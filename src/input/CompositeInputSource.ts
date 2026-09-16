import type { CommandListener, InputSource } from './InputSource.js';

export class CompositeInputSource implements InputSource {
    public constructor(private readonly sources: readonly InputSource[]) { }

    public onCommand(listener: CommandListener): () => void {
        const unsubscribes = this.sources.map((source) => source.onCommand(listener));
        return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
    }

    public dispose(): void {
        this.sources.forEach((source) => source.dispose());
    }
}
