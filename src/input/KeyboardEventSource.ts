export type KeyListener = (key: string) => void;

export interface KeyboardEventSource {
    onKeyDown(listener: KeyListener): () => void;
}
