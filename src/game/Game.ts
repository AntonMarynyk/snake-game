import type { GameAssets } from '../assets/GameAssets.js';
import { InputCommand } from '../input/InputCommand.js';
import type { InputSource } from '../input/InputSource.js';
import type { Point, Renderer } from '../rendering/Renderer.js';
import { Autobind } from '../utils/autobind.js';
import { GameView } from '../view/GameView.js';
import { GridLayout } from '../view/GridLayout.js';
import { Direction } from './Direction.js';
import { AdOutcome, type AdResult, type AdService } from '../ads/AdService.js';
import type { ExitService } from '../app/ExitService.js';
import type { MenuModel } from '../view/MenuView.js';
import type { Rules } from './Rules.js';
import { Snake } from './Snake.js';
import { AnimationFrameTicker, type Ticker } from './Ticker.js';

export type GameDependencies = {
    readonly renderer: Renderer;
    readonly input: InputSource;
    readonly assets: GameAssets;
    readonly rules: Rules;
    readonly ticker?: Ticker;
    readonly exit: ExitService;
    readonly ads: AdService;
};

export const enum GameStatus {
    Idle = 'Idle',
    Menu = 'Menu',
    Ad = 'Ad',
    Running = 'Running',
}

export const enum MenuChoice {
    Yes = 0,
    No = 1,
}

const MENU_OPTIONS: readonly string[] = ['Yes', 'No'];

const HINT = 'ARROWS move    ESC / BACKSPACE end run';

const AD_HINT = 'ADVERTISEMENT';

export const BOARD_PADDING: Point = { x: 16, y: 60 };

export const MAX_FRAME_MS = 100;

export const MAX_BUFFERED_TURNS = 2;

const COMMAND_DIRECTIONS: Partial<Record<InputCommand, Direction>> = {
    [InputCommand.MoveUp]: Direction.Up,
    [InputCommand.MoveDown]: Direction.Down,
    [InputCommand.MoveLeft]: Direction.Left,
    [InputCommand.MoveRight]: Direction.Right,
};

@Autobind
export class Game {
    private readonly view: GameView;
    private readonly ticker: Ticker;

    private snake: Snake;
    private food: Point | null = null;
    private score = 0;
    private status: GameStatus = GameStatus.Idle;

    private accumulatorMs = 0;
    private lastTimestampMs: number | null = null;
    private readonly turns: Direction[] = [];
    private unsubscribe: (() => void) | null = null;
    private menuChoice: MenuChoice = MenuChoice.Yes;
    private lastScore: number | null = null;

    public constructor(private readonly deps: GameDependencies) {
        this.view = new GameView(
            deps.renderer,
            GridLayout.fit(deps.rules.board, deps.renderer.size, BOARD_PADDING),
            deps.assets,
        );
        this.ticker = deps.ticker ?? new AnimationFrameTicker();
        this.snake = this.spawnSnake();
        this.food = this.spawnFood();
    }

    public start(): void {
        if (this.status !== GameStatus.Idle) return;

        this.unsubscribe ??= this.deps.input.onCommand(this.handleCommand);
        this.ticker.start(this.onFrame);
        void this.deps.ads.prepare().catch(noop);
        this.showMenu();
    }

    public stop(): void {
        this.ticker.stop();
        this.unsubscribe?.();
        this.unsubscribe = null;
        this.status = GameStatus.Idle;
    }

    private onFrame(timestampMs: number): void {
        const previous = this.lastTimestampMs;
        this.lastTimestampMs = timestampMs;

        const deltaMs = previous === null ? 0 : Math.min(timestampMs - previous, MAX_FRAME_MS);
        this.update(deltaMs);
        this.render();
    }

    private update(deltaMs: number): void {
        if (this.status !== GameStatus.Running) return;

        this.accumulatorMs += deltaMs;

        let interval = this.deps.rules.stepIntervalMs(this.score);
        while (this.accumulatorMs >= interval && this.status === GameStatus.Running) {
            this.accumulatorMs -= interval;
            this.step();
            interval = this.deps.rules.stepIntervalMs(this.score);
        }
    }

    private step(): void {
        this.applyBufferedTurn();

        const target = this.snake.nextHead();
        const grows = this.food !== null && this.isSameCell(target, this.food);

        if (!this.deps.rules.board.contains(target) || this.snake.occupies(target, !grows)) {
            this.endRun();
            return;
        }

        this.snake.advance(grows);
        if (!grows) return;

        this.score += this.deps.rules.pointsPerFood;
        this.food = this.spawnFood();
        if (this.food === null) {
            this.endRun();
        }
    }

    private applyBufferedTurn(): void {
        while (this.turns.length > 0) {
            const next = this.turns.shift() as Direction;
            if (this.snake.steer(next)) return;
        }
    }

    private handleCommand(command: InputCommand): void {
        if (this.status === GameStatus.Menu) {
            this.handleMenuCommand(command);
            return;
        }

        if (command === InputCommand.Cancel) {
            this.endRun();
            return;
        }


        const direction = COMMAND_DIRECTIONS[command];
        if (direction === undefined || this.status !== GameStatus.Running) return;
        if (this.turns.length < MAX_BUFFERED_TURNS) this.turns.push(direction);
    }

    private handleMenuCommand(command: InputCommand): void {
        if (command === InputCommand.MoveUp || command === InputCommand.MoveDown) {
            this.menuChoice = this.menuChoice === MenuChoice.Yes ? MenuChoice.No : MenuChoice.Yes;
            return;
        }

        if (command === InputCommand.Cancel) {
            this.deps.exit.leave();
            return;
        }

        if (command !== InputCommand.Confirm) return;

        if (this.menuChoice === MenuChoice.Yes) {
            this.playAdBreak();
            return;
        }
        this.deps.exit.leave();
    }

    private showMenu(): void {
        this.status = GameStatus.Menu;
        this.menuChoice = MenuChoice.Yes;
    }

    private playAdBreak(): void {
        this.status = GameStatus.Ad;
        void this.deps.ads.playPreRoll().then(this.onAdFinished, this.onAdFinished);
    }

    private onAdFinished(result: AdResult | unknown): void {
        const outcome = (result as AdResult)?.outcome;
        if (outcome === AdOutcome.Failed || outcome === undefined) {
            console.warn('[ads] no ad was shown:', (result as AdResult)?.error ?? result);
        }
        this.startRun();
    }

    private startRun(): void {
        this.reset();
        this.status = GameStatus.Running;
    }

    private endRun(): void {
        this.lastScore = this.score;
        this.showMenu();
    }

    private reset(): void {
        this.snake = this.spawnSnake();
        this.score = 0;
        this.accumulatorMs = 0;
        this.lastTimestampMs = null;
        this.turns.length = 0;
        this.food = this.spawnFood();
    }

    private spawnSnake(): Snake {
        const { board, initialLength, initialDirection } = this.deps.rules;
        return Snake.spawn(board.center(), initialLength, initialDirection);
    }

    private spawnFood(): Point | null {
        const { board } = this.deps.rules;
        const free: Point[] = [];

        for (let index = 0; index < board.cellCount; index += 1) {
            const cell = { x: index % board.columns, y: Math.floor(index / board.columns) };
            if (!this.snake.occupies(cell)) free.push(cell);
        }

        return free.length === 0 ? null : (free[Math.floor(Math.random() * free.length)] as Point);
    }

    private isSameCell(a: Point, b: Point): boolean {
        return a.x === b.x && a.y === b.y;
    }

    private render(): void {
        this.view.render({
            snake: this.snake.segments,
            food: this.food,
            score: this.score,
            hint: this.status === GameStatus.Ad ? AD_HINT : HINT,
            menu: this.status === GameStatus.Menu ? this.menuModel() : null,
        });
    }

    private menuModel(): MenuModel {
        return {
            title: this.lastScore === null ? 'Want to play?' : 'Want to play again?',
            subtitle: this.lastScore === null ? null : `Your score: ${this.lastScore}`,
            options: MENU_OPTIONS,
            selectedIndex: this.menuChoice,
        };
    }

}

function noop(): void {
    return;
}
