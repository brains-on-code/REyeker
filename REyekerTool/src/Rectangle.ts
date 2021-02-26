import {Coordinate} from "./Coordinate";

/**
 * A simple rectangle class, which saves the top-left and the width and height
 */
export class Rectangle{
    private readonly start : Coordinate;
    private readonly x_range : number;
    private readonly y_range : number;

    constructor(x_start: number, y_start: number, x_range: number, y_range: number) {
        this.start = new Coordinate(x_start, y_start);
        this.x_range = x_range;
        this.y_range = y_range;
    }

    get_start(): Coordinate{
        return this.start;
    }

    get_x_range():number{
        return this.x_range;
    }

    get_y_range():number{
        return this.y_range;
    }
}