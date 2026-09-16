import type { InputCommand } from './InputCommand.js';

export type CommandListener = (command: InputCommand) => void;

export interface InputSource {
    onCommand(listener: CommandListener): () => void;
    dispose(): void;
}

export type CreateInputSource = (host: HTMLElement) => InputSource;
