import type { KeyboardEventSource, KeyListener } from '../KeyboardEventSource.js';

export class DomKeyboardEventSource implements KeyboardEventSource {
    public constructor(private readonly target: EventTarget) { }

    public onKeyDown(listener: KeyListener): () => void {
        const handler = (event: Event): void => listener((event as KeyboardEvent).key);
        this.target.addEventListener('keydown', handler);
        return () => this.target.removeEventListener('keydown', handler);
    }
}
