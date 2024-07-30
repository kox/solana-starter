export // Define a type guard for error with getLogs method
function hasGetLogsMethod(error: unknown): error is { getLogs: () => Promise<string[]> } {
    return typeof error === 'object' && error !== null && 'getLogs' in error;
}