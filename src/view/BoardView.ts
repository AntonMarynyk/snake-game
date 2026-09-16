import { COLORS } from '../config.js';
import type { Renderer } from '../rendering/Renderer.js';
import type { GridLayout } from './GridLayout.js';

export class BoardView {
    public constructor(
        private readonly renderer: Renderer,
        private readonly layout: GridLayout,
    ) { }

    public draw(): void {
        this.renderer.drawRect(this.layout.bounds, {
            fill: COLORS.boardBackground,
            stroke: COLORS.boardBorder,
            lineWidth: 2,
        });
        this.drawGrid();
    }

    private drawGrid(): void {
        const { origin, cellSize, width, height, board } = this.layout;

        for (let column = 1; column < board.columns; column += 1) {
            this.renderer.drawRect(
                { x: origin.x + column * cellSize, y: origin.y, width: 1, height },
                { fill: COLORS.gridLine },
            );
        }

        for (let row = 1; row < board.rows; row += 1) {
            this.renderer.drawRect(
                { x: origin.x, y: origin.y + row * cellSize, width, height: 1 },
                { fill: COLORS.gridLine },
            );
        }
    }
}
