import { InputCommand } from '../InputCommand.js';
import type { CommandListener, InputSource } from '../InputSource.js';
import type { KeyboardEventSource } from '../KeyboardEventSource.js';

export type KeyBindings = Readonly<Record<string, InputCommand>>;

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
    ArrowUp: InputCommand.MoveUp,
    ArrowDown: InputCommand.MoveDown,
    ArrowLeft: InputCommand.MoveLeft,
    ArrowRight: InputCommand.MoveRight,
    Enter: InputCommand.Confirm,
    Escape: InputCommand.Cancel,
    Backspace: InputCommand.Cancel,
};

export class KeyboardInputSource implements InputSource {
    private readonly listeners = new Set<CommandListener>();
    private readonly unbind: () => void;

    public constructor(
        events: KeyboardEventSource,
        private readonly bindings: KeyBindings = DEFAULT_KEY_BINDINGS,
    ) {
        this.unbind = events.onKeyDown((key) => this.handleKey(key));
    }

    public onCommand(listener: CommandListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    public dispose(): void {
        this.unbind();
        this.listeners.clear();
    }

    private handleKey(key: string): void {
        const command = this.bindings[key];
        if (command === undefined) return;

        for (const listener of [...this.listeners]) {
            listener(command);
        }
    }
}
