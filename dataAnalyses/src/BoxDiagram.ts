import {Coordinate} from "./Coordinate";
import {clickDataSaver} from "./clickDataSaver";

/**
 * a function to draw the rectangle view based on the clickDataSaver
 *
 * @param context               the context where the rectangle is drawn on
 * @param current_coordinate    the coordinate where to draw the rectangle around
 */
export function drawRectangleView(context: CanvasRenderingContext2D, current_coordinate: Coordinate) {
    const x_pos: number = current_coordinate.get_x();
    const y_pos: number = current_coordinate.get_y();

    const minimal_x_half: number = clickDataSaver.minimal_width + clickDataSaver.grad_radius;
    const minimal_y_half: number = clickDataSaver.minimal_height + clickDataSaver.grad_radius;

    context.beginPath()
    context.moveTo(x_pos - minimal_x_half, y_pos - minimal_y_half);

    context.lineTo(x_pos + minimal_x_half, y_pos - minimal_y_half);
    context.lineTo(x_pos + minimal_x_half, y_pos + minimal_y_half);
    context.lineTo(x_pos - minimal_x_half, y_pos + minimal_y_half);
    context.lineTo(x_pos - minimal_x_half, y_pos - minimal_y_half);

    context.stroke();
}

/**
 * a function to draw a line view around the current coordinate on the given context
 *
 * @param context               the context where to draw on
 * @param current_coordinate    the coordinate where to draw around
 * @param width                 the max width of the image
 */
export function drawLineView(context: CanvasRenderingContext2D, current_coordinate: Coordinate, width: number) {
    const minimal_y_half: number = clickDataSaver.minimal_height + clickDataSaver.grad_radius;
    context.beginPath();
    context.moveTo(0, current_coordinate.get_y() - minimal_y_half);
    context.lineTo(width, current_coordinate.get_y() - minimal_y_half);

    context.moveTo(0, current_coordinate.get_y() + minimal_y_half);
    context.lineTo(width, current_coordinate.get_y() + minimal_y_half);

    context.stroke();
}

/**
 * a function to draw a row view around the current coordinate on the given context
 *
 * @param context               the context where to draw on
 * @param current_coordinate    the coordinate where to draw around
 * @param height                 the max height of the image
 */
export function drawRowView(context: CanvasRenderingContext2D, current_coordinate: Coordinate, height: number) {
    const minimal_x_half: number = clickDataSaver.minimal_width + clickDataSaver.grad_radius;
    context.beginPath();
    context.moveTo(current_coordinate.get_x() - minimal_x_half, 0);
    context.lineTo(current_coordinate.get_x() - minimal_x_half, height);

    context.moveTo(current_coordinate.get_x() + minimal_x_half, 0);
    context.lineTo(current_coordinate.get_x() + minimal_x_half, height);

    context.stroke();
}