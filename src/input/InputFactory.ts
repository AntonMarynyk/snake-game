import { CompositeInputSource } from './CompositeInputSource.js';
import type { CreateInputSource, InputSource } from './InputSource.js';
import { tryCatch } from '../utils/tryCatch.js';

export const enum InputKind {
    Keyboard = 'keyboard',
    Pointer = 'pointer',
    Touch = 'touch',
    Gamepad = 'gamepad',
}

export type InputProvider = {
    readonly kind: InputKind;
    isSupported(): boolean;
    readonly create: CreateInputSource;
};

export const DEFAULT_INPUT_KINDS: readonly InputKind[] = [InputKind.Keyboard, InputKind.Pointer, InputKind.Touch, InputKind.Gamepad];

export class NoInputAvailableError extends Error {
    public constructor(
        public readonly enabled: readonly InputKind[],
        public readonly attempts: readonly InputAttempt[],
    ) {
        const detail = attempts.map((a) => `${a.kind}: ${a.reason}`).join('; ');
        super(
            `No input source could be created (enabled: ${enabled.join(', ')})` +
            (detail ? ` — ${detail}` : ''),
        );
        this.name = 'NoInputAvailableError';
    }
}

export type InputAttempt = {
    readonly kind: InputKind;
    readonly reason: string;
};

export class InputFactory {
    private readonly providers: ReadonlyMap<InputKind, InputProvider>;

    public constructor(
        providers: readonly InputProvider[],
        private readonly enabled: readonly InputKind[] = DEFAULT_INPUT_KINDS,
    ) {
        this.providers = new Map(providers.map((provider) => [provider.kind, provider]));
    }
    public create(host: HTMLElement): InputSource {
        const sources: InputSource[] = [];
        const attempts: InputAttempt[] = [];

        for (const kind of this.enabled) {
            const provider = this.providers.get(kind);
            if (provider === undefined) {
                attempts.push({ kind, reason: 'no provider registered' });
                continue;
            }

            if (!provider.isSupported()) {
                attempts.push({ kind, reason: 'not supported in this browser' });
                continue;
            }

            const [source, error] = tryCatch(provider.create)(host);
            if (error === null) {
                sources.push(source);
                continue;
            }
            attempts.push({ kind, reason: error.message });
        }

        if (sources.length === 0) {
            throw new NoInputAvailableError(this.enabled, attempts);
        }
        return new CompositeInputSource(sources);
    }
}
