export class ScriptLoader {
    private readonly pending = new Map<string, Promise<void>>();

    public load(src: string, timeoutMs = 8000): Promise<void> {
        const cached = this.pending.get(src);
        if (cached !== undefined) return cached;

        const promise = new Promise<void>((resolve, reject) => {
            const element = document.createElement('script');
            const timer = window.setTimeout(() => {
                element.remove();
                reject(new Error(`Timed out loading ${src}`));
            }, timeoutMs);

            element.src = src;
            element.async = true;
            element.addEventListener('load', () => {
                window.clearTimeout(timer);
                resolve();
            });
            element.addEventListener('error', () => {
                window.clearTimeout(timer);
                element.remove();
                reject(new Error(`Failed to load ${src}`));
            });
            document.head.appendChild(element);
        });

        promise.catch(() => this.pending.delete(src));
        this.pending.set(src, promise);
        return promise;
    }
}
