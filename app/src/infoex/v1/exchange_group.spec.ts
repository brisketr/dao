import { expect } from "chai";
import { before, describe } from "mocha";

import { webcrypto } from 'crypto'
import { acknowledgeInfo, cipherDocs, computeGroupInfoHash, ExchangeContract, GlobalDataStore, Identity, infoDocs, LocalDataStore, needsCipherDocUpdate, needsOnChainCidUpdate, newInfoAvailable, publishIpfs, Staker, updateOnChainCid } from "./exchange_group";
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
	private _activeAccount: string = "";

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
		this._cids[this._activeAccount] = cid;
	}

	public async isFull(): Promise<boolean> {
		return false;
	}

	public setActiveAccount(account: string): void {
		this._activeAccount = account;
	}
}


describe.only("Exchange Group", async () => {
	let globalData: MockGlobalStore;
	let localData: MockLocalDataStore;
	let exchange: MockExchangeContract;
	let allowedIdentities: Identity[] = [];
	let notAllowedIdentities: Identity[] = [];
	let stakers: Staker[] = [];
	let accountInfoDocs: InfoDoc[] = [];

	before(async () => {
		stakers = [];
		allowedIdentities = [];
		notAllowedIdentities = [];
		accountInfoDocs = [];

		for (let i = 0; i < allowedPhrases.length; i++) {
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

			accountInfoDocs.push({
				accounts: [
					{ address: address },
				]
			});

		}

		for (let i = 0; i < notAllowedPhrases.length; i++) {
			const encrypter: RSAEncrypter = await RSAEncrypter.create(webcrypto as any, notAllowedPhrases[i]);
			const address = randomKey();

			notAllowedIdentities.push({
				address: address,
				encrypter: encrypter,
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
		const cipherDocs1 = await cipherDocs(globalData, exchange);
		expect(await newInfoAvailable(webcrypto as any, localData, cipherDocs1)).to.be.true;
		const initialHash = await computeGroupInfoHash(webcrypto as any, cipherDocs1);
		console.log(`Initial hash: ${initialHash}`);
		expect(initialHash).to.be.equal("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

		await acknowledgeInfo(localData, initialHash);
		expect(await newInfoAvailable(webcrypto as any, localData, cipherDocs1)).to.be.false;

		// Publish doc for account 0.
		globalData.setActiveId(allowedIdentities[0].address);
		const cid1 = await publishIpfs(webcrypto as any, globalData, allowedIdentities[0], exchange, accountInfoDocs[0]);
		expect(await needsOnChainCidUpdate(globalData, exchange, allowedIdentities[0])).to.be.true;
		exchange.setActiveAccount(allowedIdentities[0].address);
		await updateOnChainCid(exchange, cid1);
		expect(await needsOnChainCidUpdate(globalData, exchange, allowedIdentities[0])).to.be.false;
		const cipherDocs2 = await cipherDocs(globalData, exchange);
		expect(await newInfoAvailable(webcrypto as any, localData, cipherDocs2)).to.be.true;

		// Publish doc for account 1.
		globalData.setActiveId(allowedIdentities[1].address);
		const cid2 = await publishIpfs(webcrypto as any, globalData, allowedIdentities[1], exchange, accountInfoDocs[1]);
		exchange.setActiveAccount(allowedIdentities[1].address);
		expect(await needsOnChainCidUpdate(globalData, exchange, allowedIdentities[1])).to.be.true;
		await updateOnChainCid(exchange, cid2);
		expect(await needsOnChainCidUpdate(globalData, exchange, allowedIdentities[1])).to.be.false;

		// Verify that account 0 can access both docs.
		const docs1 = await infoDocs(webcrypto as any, globalData, exchange, allowedIdentities[0]);
		expect(docs1.size).to.be.equal(2);
		expect(docs1.get(allowedIdentities[0].address)).to.be.deep.equal(accountInfoDocs[0]);
		expect(docs1.get(allowedIdentities[1].address)).to.be.deep.equal(accountInfoDocs[1]);

		// Verify that account 1 can access one doc.
		const docs2 = await infoDocs(webcrypto as any, globalData, exchange, allowedIdentities[1]);
		expect(docs2.size).to.be.equal(1);
		expect(docs2.get(allowedIdentities[1].address)).to.be.deep.equal(accountInfoDocs[1]);

		// Publish doc again for account 0.
        expect(await needsCipherDocUpdate(globalData, exchange, allowedIdentities[0])).to.be.true;
		globalData.setActiveId(allowedIdentities[0].address);
		await publishIpfs(webcrypto as any, globalData, allowedIdentities[0], exchange, accountInfoDocs[0]);
		expect(await needsOnChainCidUpdate(globalData, exchange, allowedIdentities[1])).to.be.false;
        expect(await needsCipherDocUpdate(globalData, exchange, allowedIdentities[0])).to.be.false;

		// Verify that account 1 can access both docs.
		const docs3 = await infoDocs(webcrypto as any, globalData, exchange, allowedIdentities[1]);
		expect(docs3.size).to.be.equal(2);
		expect(docs3.get(allowedIdentities[0].address)).to.be.deep.equal(accountInfoDocs[0]);
		expect(docs3.get(allowedIdentities[1].address)).to.be.deep.equal(accountInfoDocs[1]);

		// Publish doc for account 2.
		globalData.setActiveId(allowedIdentities[2].address);
		const cid3 = await publishIpfs(webcrypto as any, globalData, allowedIdentities[2], exchange, accountInfoDocs[2]);
		exchange.setActiveAccount(allowedIdentities[2].address);
		expect(await needsOnChainCidUpdate(globalData, exchange, allowedIdentities[2])).to.be.true;
		await updateOnChainCid(exchange, cid3);
		expect(await needsOnChainCidUpdate(globalData, exchange, allowedIdentities[2])).to.be.false;

		// Verify that account 0 can access all three docs.
		const docs4 = await infoDocs(webcrypto as any, globalData, exchange, allowedIdentities[0]);
		expect(docs4.size).to.be.equal(3);
		expect(docs4.get(allowedIdentities[0].address)).to.be.deep.equal(accountInfoDocs[0]);
		expect(docs4.get(allowedIdentities[1].address)).to.be.deep.equal(accountInfoDocs[1]);
		expect(docs4.get(allowedIdentities[2].address)).to.be.deep.equal(accountInfoDocs[2]);

		// Verify that account 2 can access one doc.
		const docs5 = await infoDocs(webcrypto as any, globalData, exchange, allowedIdentities[2]);
		expect(docs5.size).to.be.equal(1);
		expect(docs5.get(allowedIdentities[2].address)).to.be.deep.equal(accountInfoDocs[2]);

		// Publish doc again for accounts 0 and 1.
        expect(await needsCipherDocUpdate(globalData, exchange, allowedIdentities[0])).to.be.true;
        expect(await needsCipherDocUpdate(globalData, exchange, allowedIdentities[1])).to.be.true;
		globalData.setActiveId(allowedIdentities[0].address);
		await publishIpfs(webcrypto as any, globalData, allowedIdentities[0], exchange, accountInfoDocs[0]);
		expect(await needsOnChainCidUpdate(globalData, exchange, allowedIdentities[0])).to.be.false;
        expect(await needsCipherDocUpdate(globalData, exchange, allowedIdentities[0])).to.be.false;
		globalData.setActiveId(allowedIdentities[1].address);
		await publishIpfs(webcrypto as any, globalData, allowedIdentities[1], exchange, accountInfoDocs[1]);
		expect(await needsOnChainCidUpdate(globalData, exchange, allowedIdentities[1])).to.be.false;
        expect(await needsCipherDocUpdate(globalData, exchange, allowedIdentities[1])).to.be.false;

		// Verify that account 2 can access all three docs.
		const docs6 = await infoDocs(webcrypto as any, globalData, exchange, allowedIdentities[2]);
		expect(docs6.size).to.be.equal(3);
		expect(docs6.get(allowedIdentities[0].address)).to.be.deep.equal(accountInfoDocs[0]);
		expect(docs6.get(allowedIdentities[1].address)).to.be.deep.equal(accountInfoDocs[1]);
		expect(docs6.get(allowedIdentities[2].address)).to.be.deep.equal(accountInfoDocs[2]);

	});
});
