export const enum AdOutcome {
    Completed = 'Completed',
    Skipped = 'Skipped',
    Failed = 'Failed',
}

export type AdResult = {
    readonly outcome: AdOutcome;
    readonly error?: string;
};

export interface AdService {
    prepare(): Promise<void>;
    playPreRoll(): Promise<AdResult>;
    dispose(): void;
}
