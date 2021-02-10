/**
 * a class for representing a 2d coordinate
 */
export class Coordinate{
    private readonly x : number;
    private readonly y : number;

    /**
     * constructor sets the x and y vvalue
     *
     * @param x
     * @param y
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * returns the x value
     */
    get_x(){
        return this.x;
    }

    /**
     * returns the y value
     */
    get_y() : number{
        return this.y;
    }

    /**
     * stringify
     */
    stringify() : string{
        return `${this.x}-${this.y}`
    }

}