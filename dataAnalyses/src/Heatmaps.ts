import {Coordinate} from "./Coordinate";
import {clickDataSaver} from "./clickDataSaver";

/**
 * a function to draw the rectangle heatmap
 *
 * @param context   the context where to draw on
 * @param min       the start index in the buffer
 * @param max       the end index in the buffer
 * @param buffer    the buffer for the coordinates to draw for the rectangle heatmap
 */
export function drawRectangleHeatMap(context: CanvasRenderingContext2D, min : number, max: number, buffer: Coordinate[]){
    const minimal_x_half : number= clickDataSaver.minimal_width + clickDataSaver.grad_radius;
    const minimal_y_half : number= clickDataSaver.minimal_height + clickDataSaver.grad_radius;
    const opacity : number= 0.9/(max-min+1);
    context.fillStyle = "rgba(0,255,0," + opacity + ")";

    for(let i=min; i<=max; i++){
        context.fillRect(buffer[i].get_x()-minimal_x_half,buffer[i].get_y()-minimal_y_half, 2*minimal_x_half, 2*minimal_y_half);

    }
    context.fillStyle = "rgba(0,0,0,1)";
}

/**
 * a function to draw a heatmap which only uses the vertical data of the coordinates
 *
 * @param context   the context where to draw on
 * @param min       the start index in the buffer
 * @param max       the end index in the buffer
 * @param buffer    the buffer with the coordinate data
 * @param maxWidth  the maxWidth where to draw the vertical heatmap
 */
export function drawVerticalHeatMap(context: CanvasRenderingContext2D, min : number, max: number, buffer: Coordinate[], maxWidth: number){
    const minimal_y_half: number = clickDataSaver.minimal_height + clickDataSaver.grad_radius;
    const opacity : number= 0.9/(max-min+1);
    context.fillStyle = "rgba(255,0,0," + opacity + ")";

    for(let i=min; i<=max; i++){
        context.fillRect(0,buffer[i].get_y()-minimal_y_half, maxWidth, 2*minimal_y_half);

    }
    context.fillStyle = "rgba(0,0,0,1)";
}

/**
 * a function to draw a heatmap which only uses the horizontal data of the coordinates
 *
 * @param context   the context where to draw on
 * @param min       the start index in the buffer
 * @param max       the end index in the buffer
 * @param buffer    the buffer with the coordinate data
 * @param maxHeight the max height where to draw the horizontal heatmap
 */
export function drawHorizontalHeatMap(context: CanvasRenderingContext2D, min : number, max: number, buffer: Coordinate[], maxHeight: number){
    const minimal_x_half : number= clickDataSaver.minimal_width + clickDataSaver.grad_radius;
    const opacity : number= 0.9/(max-min+1);
    context.fillStyle = "rgba(0,0,255," + opacity + ")";

    for(let i=min; i<=max; i++){
        context.fillRect(buffer[i].get_x()-minimal_x_half,0, 2*minimal_x_half, maxHeight);

    }
    context.fillStyle = "rgba(0,0,0,1)";
}