import { writable } from "svelte/store";
import { address, ethersProvider } from "../../web3/stores";
import type { EthersExchangeContract } from "./exchange_contract_ethers";
import { exchangeContractGenesis } from "./stores";

export const timeUntilUnlock = writable(0);
export const formattedTimeUntilUnlock = writable("");

let countdownInterval = null;
let timeUntilUnlockLocal = 0;
let addressLocal = null;
let genesisContract: EthersExchangeContract = null;

export function formatTimeUntilUnlock(secondsUntilUnlock: number): string {
	const hours = Math.floor(secondsUntilUnlock / 3600);
	const seconds = secondsUntilUnlock % 3600;
	return `${hours}h ${seconds}s`;
}

export async function refreshCountdownInterval() {
	if (addressLocal == null) {
		return;
	}

	if (genesisContract == null) {
		return;
	}

	timeUntilUnlockLocal = (await genesisContract.contract().timeUntilUnlock(addressLocal)).toNumber();

	// Clear any existing countdown interval.
	if (countdownInterval) {
		clearInterval(countdownInterval);
	}

	// Update countdown seconds every second.
	countdownInterval = setInterval(() => {
		if (timeUntilUnlockLocal > 0) {
			timeUntilUnlockLocal--;
			timeUntilUnlock.set(timeUntilUnlockLocal);
			formattedTimeUntilUnlock.set(formatTimeUntilUnlock(timeUntilUnlockLocal));
		} else {
			timeUntilUnlock.set(0);
			formattedTimeUntilUnlock.set("0");
		}
	}, 1000);
}

address.subscribe((a: string) => {
	addressLocal = a;
	refreshCountdownInterval();
});

ethersProvider.subscribe(p => {
	if (p == null) {
		return;
	}

	p.on("block", () => {
		refreshCountdownInterval();
	});
});

exchangeContractGenesis.subscribe((c: EthersExchangeContract) => {
	genesisContract = c;
	refreshCountdownInterval();
});
