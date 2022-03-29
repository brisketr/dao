import type { InfoExchange } from "@brisket-dao/core";
import { BigNumber, ethers } from "ethers";
import type { ExchangeContract, Staker } from "./exchange_contract";

export class EthersExchangeContract implements ExchangeContract {
	private _contract: InfoExchange;

	constructor(contract: InfoExchange) {
		this._contract = contract;
	}

	contract(): InfoExchange {
		return this._contract;
	}

	async topStakers(): Promise<Staker[]> {
		let stakers: Staker[] = [];
		const stakerAddresses = await this._contract.topStakers();

		for (const address of stakerAddresses) {
			// Skip if address is zero.
			if (address === ethers.constants.AddressZero) {
				continue;
			}

			stakers.push({
				address: address,
				staked: await this._contract.stakedBalance(address)
			});
		}

		return stakers;
	}

	minStake(): Promise<BigNumber> {
		return this._contract.minStake();
	}

	timeUntilEvict(): Promise<BigNumber> {
		return this._contract.timeUntilEvict();
	}

	isFull(): Promise<boolean> {
		return this._contract.isFull();
	}

	cid(address: string): Promise<string> {
		return this._contract.cid(address);
	}

	registerCid(cid: string): Promise<void> {
		const ec = this;
		return new Promise<void>((resolve, reject) => {
			ec._contract.registerCid(cid).then(() => {
				resolve();
			}).catch((error) => {
				reject(error);
			});
		});
	}
}
