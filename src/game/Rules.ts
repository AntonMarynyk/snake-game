import { Board } from './Board.js';
import { Direction } from './Direction.js';

export interface Rules {
    readonly board: Board;
    readonly initialLength: number;
    readonly initialDirection: Direction;
    readonly pointsPerFood: number;
    stepIntervalMs(score: number): number;
}

export type ClassicRulesOptions = {
    readonly columns: number;
    readonly rows: number;
    readonly initialLength: number;
    readonly initialDirection: Direction;
    readonly pointsPerFood: number;
    readonly startIntervalMs: number;
    readonly minIntervalMs: number;
    readonly speedUpPerPoint: number;
};

export const CLASSIC_RULES: ClassicRulesOptions = {
    columns: 30,
    rows: 15,
    initialLength: 4,
    initialDirection: Direction.Right,
    pointsPerFood: 10,
    startIntervalMs: 130,
    minIntervalMs: 60,
    speedUpPerPoint: 0.6,
};

export class ClassicRules implements Rules {
    public readonly board: Board;
    public readonly initialLength: number;
    public readonly initialDirection: Direction;
    public readonly pointsPerFood: number;

    public constructor(private readonly options: ClassicRulesOptions = CLASSIC_RULES) {
        this.board = new Board(options.columns, options.rows);
        this.initialLength = options.initialLength;
        this.initialDirection = options.initialDirection;
        this.pointsPerFood = options.pointsPerFood;
    }

    public stepIntervalMs(score: number): number {
        return Math.max(
            this.options.minIntervalMs,
            this.options.startIntervalMs - score * this.options.speedUpPerPoint,
        );
    }
}
