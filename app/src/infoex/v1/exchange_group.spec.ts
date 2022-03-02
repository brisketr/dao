import { expect } from "chai";
import { before, describe } from "mocha";

import { webcrypto } from 'crypto'
import { acknowledgeInfo, cipherDocs, computeGroupInfoHash, ExchangeContract, GlobalDataStore, Identity, LocalDataStore, newInfoAvailable, publishIpfs, Staker } from "./exchange_group";
import { BigNumber } from "ethers";
import { RSAEncrypter } from "./encryption";
import type { InfoDoc } from "./cipher_doc";

const allowedPhrases = [
	"cruel verify defy trust mansion catch avoid enhance valid giraffe scare possible cricket useless interest",
	"clean acid dirt develop rotate spatial cousin slender rare snap pelican travel roof rent focus",
	"confirm sick void pluck flat citizen crumble piece clinic photo avoid express birth protect net"
];

const notAllowedPhrases = [
	"lazy bracket found polar utility judge flavor solution climb gentle prefer know brush fiscal board",
	"wrestle champion cotton cabbage bonus try birth eternal float color evidence behave essay riot hockey"
];

function randomKey(): string {
	return "0x" + Math.random().toString(16).substr(2);
}

class MockGlobalStore implements GlobalDataStore {
	private _data: { [key: string]: string } = {};
	private _names: { [key: string]: { [key: string]: string } } = {};
	private _activeId: string = "";

	public async get(key: string): Promise<string> {
		if (this._data[key]) {
			return this._data[key];
		}

		throw new Error("Key not found");
	}

	public async put(value: string): Promise<string> {
		const key = randomKey();
		this._data[key] = value;
		return key;
	}

	public async resolveName(name: string, subKey: string): Promise<string> {
		if (this._names[name]) {
			if (this._names[name][subKey]) {
				return this._names[name][subKey];
			} else {
				throw new Error("Subkey not found");
			}
		} else {
			throw new Error("Name not found");
		}
	}

	public async publishName(subKey: string, contentKey: string): Promise<string> {
		const name = this._activeId;
		this._names[name] = { [subKey]: contentKey };
		return name;
	}

	public setActiveId(id: string): void {
		this._activeId = id;
	}
}

class MockLocalDataStore implements LocalDataStore {
	private _data: { [key: string]: string } = {};

	public async get(key: string): Promise<string> {
		return this._data[key];
	}

	public async put(key: string, value: string): Promise<void> {
		this._data[key] = value;
	}

	public async load(): Promise<void> { }

	public async save(): Promise<void> { }
}

class MockExchangeContract implements ExchangeContract {
	public stakers: Staker[] = [];
	private _cids: { [key: string]: string } = {};

	public async topStakers(): Promise<Staker[]> {
		return this.stakers;
	}

	public async minStake(): Promise<BigNumber> {
		return BigNumber.from(0);
	}

	public async timeUntilEvict(): Promise<BigNumber> {
		return BigNumber.from(0);
	}

	public async cid(address: string): Promise<string> {
		return this._cids[address];
	}

	public async registerCid(cid: string): Promise<void> {
		this._cids[cid] = cid;
	}

	public async isFull(): Promise<boolean> {
		return false;
	}
}


describe.only("Exchange Group", async () => {
	let globalData: MockGlobalStore;
	let localData: MockLocalDataStore;
	let exchange: MockExchangeContract;
	let allowedIdentities: Identity[] = [];
	let stakers: Staker[] = [];
	let infoDocs: InfoDoc[] = [];

	before(async () => {
		for (let i = 0; i < allowedPhrases.length; i++) {
			console.log(`Generating identity ${i}`);
			const encrypter: RSAEncrypter = await RSAEncrypter.create(webcrypto as any, allowedPhrases[i]);
			const address = randomKey();

			stakers.push({
				address: address,
				staked: BigNumber.from(0),
			});

			allowedIdentities.push({
				address: address,
				encrypter: encrypter,
			});

			infoDocs.push({
				accounts: [
					{ address: address },
				]
			});

		}
	});

	beforeEach(() => {
		globalData = new MockGlobalStore();
		localData = new MockLocalDataStore();
		exchange = new MockExchangeContract();
		exchange.stakers = stakers;
	});

	it("should support exchanging enrypted info between top stakers", async () => {
		// Verify initial state with no CIDs set
		const docs = await cipherDocs(globalData, exchange);
		expect(await newInfoAvailable(webcrypto as any, localData, docs)).to.be.true;
		const initialHash = await computeGroupInfoHash(webcrypto as any, docs);
		console.log(`Initial hash: ${initialHash}`);
		expect(initialHash).to.be.equal("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

		await acknowledgeInfo(localData, initialHash);
		expect(await newInfoAvailable(webcrypto as any, localData, docs)).to.be.false;

		// Publish doc for account 1.
		globalData.setActiveId(allowedIdentities[0].address);
		await publishIpfs(webcrypto as any, globalData, allowedIdentities[0], exchange, infoDocs[0]);


	});
});
