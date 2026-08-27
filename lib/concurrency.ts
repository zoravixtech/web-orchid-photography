/**
 * Runs `fn` over `items` with at most `limit` in flight at once, preserving
 * result order. Capping concurrency keeps peak network and memory usage bounded
 * regardless of batch size when uploading multiple files.
 */
export async function mapWithConcurrencyLimit<T, R>(
    items: T[],
    limit: number,
    fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
    const results = new Array<R>(items.length);
    let next = 0;

    async function worker() {
        while (next < items.length) {
            const index = next++;
            results[index] = await fn(items[index], index);
        }
    }

    const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
    await Promise.all(workers);
    return results;
}
