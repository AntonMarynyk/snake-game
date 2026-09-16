import type { GameAssets } from '../assets/GameAssets.js';
import type { InputSource } from '../input/InputSource.js';
import type { Point, Renderer } from '../rendering/Renderer.js';
import { GameView } from '../view/GameView.js';
import { GridLayout } from '../view/GridLayout.js';
import { Autobind } from '../utils/autobind.js';
import type { InputCommand } from '../input/InputCommand.js';
import type { Rules } from './Rules.js';

export type GameDependencies = {
    readonly renderer: Renderer;
    readonly input: InputSource;
    readonly assets: GameAssets;
    readonly rules: Rules;
};

export const BOARD_PADDING: Point = { x: 16, y: 60 };

@Autobind
export class Game {
    private readonly view: GameView;
    private unsubscribe: (() => void) | null = null;

    public constructor(private readonly deps: GameDependencies) {
        this.view = new GameView(
            deps.renderer,
            GridLayout.fit(deps.rules.board, deps.renderer.size, BOARD_PADDING),
            deps.assets,
        );
    }

    public start(): void {
        if (this.unsubscribe !== null) return;

        this.unsubscribe = this.deps.input.onCommand(this.handleCommand);
        this.render();
    }

    public stop(): void {
        this.unsubscribe?.();
        this.unsubscribe = null;
    }

    private handleCommand(command: InputCommand): void {
        console.log('[input]', command);
    }

    private render(): void {
        const { board, initialLength, initialDirection } = this.deps.rules;
        const head = board.center();

        this.view.render({
            snake: Array.from({ length: initialLength }, (_, index) => ({
                x: head.x - index,
                y: head.y,
            })),
            food: { x: head.x + 5, y: head.y - 3 },
            score: 0,
            hint: `${initialDirection} — ARROWS move    ENTER confirm    ESC / BACKSPACE cancel`,
        });
    }
}
