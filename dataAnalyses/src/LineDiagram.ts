import {Coordinate} from "./Coordinate";
import {clickDataSaver} from "./clickDataSaver";

/**
 * a function to draw the vertical line diagram
 *
 * @param context       the context to draw on
 * @param min           the starting index in the buffer
 * @param max           the ending index in the buffer
 * @param buffer        the buffer with the coordinate value
 * @param startWith     the value where to start drawing the line diagramm
 */
export function drawVerticalLineDiagram(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], startWith: number = 3) {
    let current_x: number = startWith;

    context.beginPath();
    context.moveTo(current_x, buffer[0].get_y());

    for (let i = min; i <= max; i++) {
        context.lineTo(current_x, buffer[i].get_y());
        current_x += 3;
        context.lineTo(current_x, buffer[i].get_y());
    }

    context.stroke();
}

/**
 * a function to draw the horizontal line diagram
 *
 * @param context       the context to draw on
 * @param min           the starting index in the buffer
 * @param max           the ending index in the buffer
 * @param buffer        the buffer with the coordinate value
 */
export function drawHorizontalLineDiagram(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[]) {
    let current_y: number = 1;

    context.beginPath();
    context.moveTo(buffer[0].get_x(), current_y);

    for (let i = min; i <= max; i++) {
        context.lineTo(buffer[i].get_x(), current_y);
        current_y += 3;
        context.lineTo(buffer[i].get_x(), current_y);
    }

    context.stroke();
}