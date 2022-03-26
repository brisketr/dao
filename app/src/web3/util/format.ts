import { BigNumber, ethers } from "ethers";

export function formatBigNumber(
	value: BigNumber,
	minFractionDigits: number = 0,
	maxFractionDigits: number = 18
): string {
	return parseFloat(
		ethers.utils.formatUnits(value, 18)
	).toLocaleString("en-US", {
		maximumFractionDigits: maxFractionDigits,
		minimumFractionDigits: minFractionDigits
	});
}
