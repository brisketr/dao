export function logInfo(...args: any[]): void {
	console.log("exchange_group - INFO - ", ...args);
}

export function logError(...args: any[]): void {
	console.error("exchange_group - ERROR - ", ...args);
}

export function logWarn(...args: any[]): void {
	console.warn("exchange_group - WARN - ", ...args);
}
