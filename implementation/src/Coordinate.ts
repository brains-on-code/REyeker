/**
 * basic coordinate class
 */
export class Coordinate{
    private readonly x : number;
    private readonly y : number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get_x(){
        return this.x;
    }

    get_y() : number{
        return this.y;
    }
}