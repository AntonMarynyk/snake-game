import { Autobind } from '../../utils/autobind.js';
import { InputKind, type InputProvider } from '../InputFactory.js';
import type { InputSource } from '../InputSource.js';
import { DomKeyboardEventSource } from './DomKeyboardEventSource.js';
import { DEFAULT_KEY_BINDINGS, KeyboardInputSource, type KeyBindings } from './KeyboardInputSource.js';

@Autobind
export class KeyboardInputProvider implements InputProvider {
    public readonly kind = InputKind.Keyboard;

    public constructor(
        private readonly bindings: KeyBindings = DEFAULT_KEY_BINDINGS,
        private readonly target: EventTarget = window,
    ) { }

    public isSupported(): boolean {
        return typeof this.target.addEventListener === 'function';
    }

    public create(): InputSource {
        return new KeyboardInputSource(new DomKeyboardEventSource(this.target), this.bindings);
    }
}
