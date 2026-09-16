import { COLORS } from '../config.js';
import type { GameAssets } from '../assets/GameAssets.js';
import type { Point, Renderer } from '../rendering/Renderer.js';
import { BoardView } from './BoardView.js';
import type { GridLayout } from './GridLayout.js';
import { HudView } from './HudView.js';

export type GameViewModel = {
    readonly snake: readonly Point[];
    readonly food: Point | null;
    readonly score: number;
    readonly hint: string;
};

export class GameView {
    private readonly board: BoardView;
    private readonly hud: HudView;

    public constructor(
        private readonly renderer: Renderer,
        private readonly layout: GridLayout,
        private readonly assets: GameAssets,
    ) {
        this.board = new BoardView(renderer, layout);
        this.hud = new HudView(renderer);
    }

    public render(model: GameViewModel): void {
        this.renderer.beginFrame();
        this.renderer.clear(COLORS.background);

        this.board.draw();
        this.drawFood(model.food);
        this.drawSnake(model.snake);
        this.hud.draw({ score: model.score, hint: model.hint });

        this.renderer.endFrame();
    }

    private drawSnake(snake: readonly Point[]): void {
        snake.forEach((cell, index) => {
            const sprite = index === 0 ? this.assets.snakeHead : this.assets.snakeBody;
            this.renderer.drawImage(sprite, this.layout.cellRect(cell, 2));
        });
    }

    private drawFood(food: Point | null): void {
        if (food === null) return;
        this.renderer.drawImage(this.assets.food, this.layout.cellRect(food, 2));
    }
}
