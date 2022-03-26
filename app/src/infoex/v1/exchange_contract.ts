import type { BigNumber } from "ethers";

export interface Staker {
	address: string;
	staked: BigNumber;
}

export interface ExchangeContract {
	topStakers(): Promise<Staker[]>;
	minStake(): Promise<BigNumber>;
	timeUntilEvict(): Promise<BigNumber>;
	isFull(): Promise<boolean>;
	cid(address: string): Promise<string>;
	registerCid(cid: string): Promise<void>;
}
