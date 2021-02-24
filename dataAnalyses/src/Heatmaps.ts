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
export function drawShapeHeatMap(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[]) {
    const opacity: number = 1.3 / (max - min + 1);
    context.fillStyle = "rgba(0,255,0," + opacity + ")";
    context.strokeStyle = "rgba(0,255,0," + opacity + ")";

    if (clickDataSaver.use_rectangle) {
        const minimal_x_half: number = clickDataSaver.minimal_width + clickDataSaver.grad_radius;
        const minimal_y_half: number = clickDataSaver.minimal_height + clickDataSaver.grad_radius;
        for (let i = min; i <= max; i++) {
            context.fillRect(buffer[i].get_x() - minimal_x_half, buffer[i].get_y() - minimal_y_half, 2 * minimal_x_half, 2 * minimal_y_half);


        }
    }else if(clickDataSaver.use_circle) {
        const radius: number = clickDataSaver.radius + clickDataSaver.grad_radius;
        for(let i=min; i<=max; i++){
            context.beginPath()
            context.arc(buffer[i].get_x(), buffer[i].get_y(), radius, 0, 2*Math.PI);
            context.fill();
            context.stroke();
        }
    }else if(clickDataSaver.use_ellipse) {
        const x_radius: number = clickDataSaver.radius_x + clickDataSaver.grad_radius;
        const y_radius: number = clickDataSaver.radius_y + clickDataSaver.grad_radius;
        for(let i=min; i<=max; i++){
            context.beginPath()
            context.ellipse(buffer[i].get_x(), buffer[i].get_y(), x_radius, y_radius, 0, 0, 2*Math.PI);
            context.fill();
            context.stroke();
        }
    }
    context.fillStyle = "rgba(0,0,0,1)";
    context.strokeStyle = "rgba(1,1,1,1)";
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
export function drawVerticalHeatMap(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], maxWidth: number) {
    let minimal_y_half: number;
    if(clickDataSaver.use_rectangle){
        minimal_y_half = clickDataSaver.minimal_height + clickDataSaver.grad_radius;
    }else if(clickDataSaver.use_circle){
        minimal_y_half = clickDataSaver.radius + clickDataSaver.grad_radius;
    }else{
        minimal_y_half = clickDataSaver.radius_y + clickDataSaver.grad_radius;
    }

    const opacity: number = 0.9 / (max - min + 1);
    context.fillStyle = "rgba(255,0,0," + opacity + ")";

    for (let i = min; i <= max; i++) {
        context.fillRect(0, buffer[i].get_y() - minimal_y_half, maxWidth, 2 * minimal_y_half);

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
export function drawHorizontalHeatMap(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], maxHeight: number) {
    let minimal_x_half: number;
    if(clickDataSaver.use_rectangle){
        minimal_x_half = clickDataSaver.minimal_width + clickDataSaver.grad_radius;
    }else if(clickDataSaver.use_circle){
        minimal_x_half = clickDataSaver.radius + clickDataSaver.grad_radius;
    }else{
        minimal_x_half = clickDataSaver.radius_x + clickDataSaver.grad_radius;
    }
    const opacity: number = 0.9 / (max - min + 1);
    context.fillStyle = "rgba(0,0,255," + opacity + ")";

    for (let i = min; i <= max; i++) {
        context.fillRect(buffer[i].get_x() - minimal_x_half, 0, 2 * minimal_x_half, maxHeight);

    }
    context.fillStyle = "rgba(0,0,0,1)";
}