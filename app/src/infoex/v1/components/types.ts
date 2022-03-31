import type { Staker } from "../exchange_contract";

export interface ExchangeStaker extends Staker {
	position: number;
	total: number;
}
