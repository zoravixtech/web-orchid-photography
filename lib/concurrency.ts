/**
 * Runs `fn` over `items` with at most `limit` in flight at once, preserving
 * result order. Native client-side image compression (`createImageBitmap` and canvas)
 * allocates memory buffers. Capping concurrency keeps peak memory and network usage
 * strictly bounded (e.g. 1-3 files at a time) regardless of batch size.
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
