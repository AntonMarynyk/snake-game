import type { Point } from '../rendering/Renderer.js';

export const enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right',
}

const VECTORS: Readonly<Record<Direction, Point>> = {
    [Direction.Up]: { x: 0, y: -1 },
    [Direction.Down]: { x: 0, y: 1 },
    [Direction.Left]: { x: -1, y: 0 },
    [Direction.Right]: { x: 1, y: 0 },
};

const OPPOSITES: Readonly<Record<Direction, Direction>> = {
    [Direction.Up]: Direction.Down,
    [Direction.Down]: Direction.Up,
    [Direction.Left]: Direction.Right,
    [Direction.Right]: Direction.Left,
};

export function directionVector(direction: Direction): Point {
    return VECTORS[direction];
}

export function isOpposite(a: Direction, b: Direction): boolean {
    return OPPOSITES[a] === b;
}
