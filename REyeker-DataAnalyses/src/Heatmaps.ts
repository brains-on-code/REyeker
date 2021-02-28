import {Coordinate} from "./Coordinate";
import {clickDataSaver} from "./clickDataSaver";

/**
 * interpolates a value to get the classic Heat map look
 *
 * @param value interpolation value
 */
function heatMapColorForValue(value) {
    let h = (1.0 - value) * 240
    return "hsla(" + h + ", 100%, 50%, 0.5)";
}

function to_index(width_idx: number, height_idx: number, max_width: number): number {
    return height_idx * max_width + width_idx;
}

function fillRectangleHelper(x_min: number, x_max: number, y_min: number, y_max: number,
                             minimal_x_rect: number, maximal_x_rect: number,
                             minimal_y_rect: number, maximal_y_rect: number,
                             minimal_width: number, minimal_height: number, grad_radius: number,
                             x: number, y: number,
                             heat_values: number[], time: number, max_width: number) {
    for (let i = x_min; i < x_max; i++) {
        for (let j = y_min; j < y_max; j++) {
            let idx = to_index(i, j, max_width);
            if (i >= minimal_x_rect && i <= maximal_x_rect && j >= minimal_y_rect && j <= maximal_y_rect) {
                heat_values[idx] += time;
            } else {
                let y_distance = Math.sqrt(Math.pow(y - j, 2));
                let x_distance = Math.sqrt(Math.pow(x - i, 2));

                let x_distance_normalized: number = Math.max(0, x_distance - minimal_width);
                x_distance_normalized = Math.max(0, x_distance_normalized / grad_radius);

                let y_distance_normalized: number = Math.max(0, y_distance - minimal_height);
                y_distance_normalized = Math.max(0, y_distance_normalized / grad_radius);

                const distance: number = Math.min(1, x_distance_normalized + y_distance_normalized);
                const alpha: number = 1 - distance;
                heat_values[idx] += alpha * time;
            }
        }
    }
}

/**
 * a function to fill the heat_values based on a rectangle
 *
 * @param heat_values   array of current heat values
 * @param x             x of rectangle
 * @param y             y of rectangle
 * @param max_width     max width to draw
 * @param max_height    max height to draw
 * @param time          time in ms if used
 */
function fillForRectangle(heat_values: number[], x: number, y, max_width: number, max_height: number, time: number = 1) {
    const minimal_x_rect: number = x - clickDataSaver.minimal_width;
    const maximal_x_rect: number = x + clickDataSaver.minimal_width;
    const minimal_y_rect: number = y - clickDataSaver.minimal_height;
    const maximal_y_rect: number = y + clickDataSaver.minimal_height;

    const x_min = Math.max(x - clickDataSaver.minimal_width - clickDataSaver.grad_radius, 0);
    const x_max = Math.max(x + clickDataSaver.minimal_width + clickDataSaver.grad_radius, max_width);

    const y_min = Math.max(y - clickDataSaver.minimal_height - clickDataSaver.grad_radius, 0);
    const y_max = Math.max(y + clickDataSaver.minimal_height + clickDataSaver.grad_radius, max_height);

    fillRectangleHelper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect, maximal_y_rect,
        clickDataSaver.minimal_width, clickDataSaver.minimal_height, clickDataSaver.grad_radius,
        x, y, heat_values, time, max_width);
}

/**
 * a function to fill the heat_values based on a ellipse
 *
 * @param heat_values   array of current heat values
 * @param x             x of rectangle
 * @param y             y of rectangle
 * @param max_width     max width to draw
 * @param max_height    max height to draw
 * @param time          time in ms if used
 */
function fillForEllipse(heat_values: number[], x: number, y, max_width: number, max_height: number, time: number = 1) {
    const x_min = Math.max(x - clickDataSaver.radius_x - clickDataSaver.grad_radius, 0);
    const x_max = Math.max(x + clickDataSaver.radius_x + clickDataSaver.grad_radius, max_width);

    const y_min = Math.max(y - clickDataSaver.radius_y - clickDataSaver.grad_radius, 0);
    const y_max = Math.max(y + clickDataSaver.radius_y + clickDataSaver.grad_radius, max_height);

    let x_rad_square = Math.pow(clickDataSaver.radius_x, 2);
    let y_rad_square = Math.pow(clickDataSaver.radius_y, 2);

    let x_rad_grad_square = Math.pow(clickDataSaver.radius_x + clickDataSaver.grad_radius, 2);
    let y_rad_grad_square = Math.pow(clickDataSaver.radius_y + clickDataSaver.grad_radius, 2);

    for (let height_iter: number = y_min; height_iter < y_max; height_iter++) {
        for (let width_iter: number = x_min; width_iter < x_max; width_iter++) {

            let clear = Math.pow(width_iter - x, 2) / x_rad_square + Math.pow(height_iter - y, 2) / y_rad_square <= 1;
            let inter_value = Math.pow(width_iter - x, 2) / x_rad_grad_square + Math.pow(height_iter - y, 2) / y_rad_grad_square;
            let interpolate = inter_value <= 1;

            let idx = to_index(width_iter, height_iter, max_width);

            if (clear) {
                heat_values[idx] += time;
            } else if (interpolate) {

                let x_distance = Math.abs(x - width_iter);
                let y_distance = Math.abs(y - height_iter);
                let x_distance_normalized: number = Math.max(0, x_distance - clickDataSaver.radius_x);
                x_distance_normalized = Math.max(0, x_distance_normalized / clickDataSaver.grad_radius);

                let y_distance_normalized: number = Math.max(0, y_distance - clickDataSaver.radius_y);
                y_distance_normalized = Math.max(0, y_distance_normalized / clickDataSaver.grad_radius);

                const distance: number = Math.min(1, Math.sqrt(Math.pow(x_distance_normalized,2)+ Math.pow(y_distance_normalized,2)));
                const alpha: number = 1.0 - distance;

                heat_values[idx] += alpha * time;
            }
        }
    }
}


/**
 * a function to fill the heat_values based on a circle
 *
 * @param heat_values   array of current heat values
 * @param x             x of rectangle
 * @param y             y of rectangle
 * @param max_width     max width to draw
 * @param max_height    max height to draw
 * @param time          time in ms if used
 */
function fillForCircle(heat_values: number[], x: number, y, max_width: number, max_height: number, time: number = 1) {
    const x_min = Math.max(x - clickDataSaver.radius - clickDataSaver.grad_radius, 0);
    const x_max = Math.max(x + clickDataSaver.radius + clickDataSaver.grad_radius, max_width);

    const y_min = Math.max(y - clickDataSaver.radius - clickDataSaver.grad_radius, 0);
    const y_max = Math.max(y + clickDataSaver.radius + clickDataSaver.grad_radius, max_height);

    let rad_square = Math.pow(clickDataSaver.radius, 2);
    let rad_grad_square = Math.pow(clickDataSaver.radius + clickDataSaver.grad_radius, 2);

    for (let height_iter: number = y_min; height_iter < y_max; height_iter++) {
        for (let width_iter: number = x_min; width_iter < x_max; width_iter++) {

            let clear = Math.pow(width_iter - x, 2) + Math.pow(height_iter - y, 2) <= rad_square;
            let inter_value = Math.pow(width_iter - x, 2) + Math.pow(height_iter - y, 2);
            let interpolate = inter_value <= rad_grad_square;

            let idx = to_index(width_iter, height_iter, max_width);

            if (clear) {
                heat_values[idx] += time;
            } else if (interpolate) {
                let x_distance = Math.abs(x - width_iter);
                let y_distance = Math.abs(y - height_iter);

                let x_distance_normalized: number = Math.max(0, x_distance - clickDataSaver.radius);
                x_distance_normalized = Math.max(0, x_distance_normalized / clickDataSaver.grad_radius);

                let y_distance_normalized: number = Math.max(0, y_distance - clickDataSaver.radius);
                y_distance_normalized = Math.max(0, y_distance_normalized / clickDataSaver.grad_radius);

                const distance: number = Math.min(1, Math.sqrt(Math.pow(x_distance_normalized,2)+ Math.pow(y_distance_normalized,2)));
                const alpha: number = 1.0 - distance;

                heat_values[idx] += alpha * time;
            }
        }
    }
}

/**
 * returns a time value based on click log
 *
 * @param idx current index
 */
function get_time(idx: number): number {
    let time: number = 1;
    if (clickDataSaver.use_times && idx === clickDataSaver.get_current_time_log().length - 1) {
        //estimation, may need other approach
        let average: number = clickDataSaver.get_current_time_log().reduce(function (pv, pc) {
            return pv + pc;
        }, 0);
        time = Math.floor(average / clickDataSaver.get_current_time_log().length);
    } else if (clickDataSaver.use_times) {
        time = clickDataSaver.get_current_time_log()[idx + 1] - clickDataSaver.get_current_time_log()[idx];
    }
    return time
}

/**
 * normalized the heat values to 0..1
 *
 * @param heat_values
 */
function normalize_heat(heat_values: number[]) {
    let max_value = 0;
    for (let i = 0; i < heat_values.length; i++) {
        if (max_value < heat_values[i]) {
            max_value = heat_values[i];
        }
    }
    for (let i = 0; i < heat_values.length; i++) {
        heat_values[i] = heat_values[i] / max_value;
    }
}

/**
 * draws the heat values to the canvas
 *
 * @param context       the context to draw on
 * @param heat_values   the heat values
 * @param max_width     max width of array
 * @param max_height    max height of array
 */
function draw_heat(context: CanvasRenderingContext2D, heat_values: number[], max_width: number, max_height: number) {
    context.beginPath();
    for (let i = 0; i < max_width; i++) {
        for (let j = 0; j < max_height; j++) {
            let idx = to_index(i, j, max_width);
            context.fillStyle = heatMapColorForValue(heat_values[idx])
            context.fillRect(i, j, 1, 1);
        }
    }
    context.stroke();
}

/**
 * a function to draw the rectangle heatmap
 *
 * @param context       the context where to draw on
 * @param min           the start index in the buffer
 * @param max           the end index in the buffer
 * @param buffer        the buffer for the coordinates to draw for the rectangle heatmap
 * @param max_width     max width of the array
 * @param max_height    max height of the array
 */
export function drawShapeHeatMap(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], max_width: number, max_height: number) {
    let heat_values: number[] = [];
    for (let i = 0; i < max_width * max_height; i++) {
        heat_values.push(0)
    }

    if (clickDataSaver.use_rectangle) {
        for (let i = min; i <= max; i++) {
            let time: number = get_time(i);
            fillForRectangle(heat_values, buffer[i].get_x(), buffer[i].get_y(), max_width, max_height, time);
        }

    } else if (clickDataSaver.use_circle) {
        for (let i = min; i <= max; i++) {
            let time: number = get_time(i);
            fillForCircle(heat_values, buffer[i].get_x(), buffer[i].get_y(), max_width, max_height, time);
        }
    } else if (clickDataSaver.use_ellipse) {
        for (let i = min; i <= max; i++) {
            let time: number = get_time(i);
            fillForEllipse(heat_values, buffer[i].get_x(), buffer[i].get_y(), max_width, max_height, time)
        }
    }

    normalize_heat(heat_values);
    draw_heat(context, heat_values, max_width, max_height)

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
 * @param maxHeight the maxHeight where to draw the vertical heatmap
 */
export function drawVerticalHeatMap(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], maxWidth: number, maxHeight: number) {
    let minimal_y_half: number;
    let minimal_y_half_grad: number;
    let x = maxWidth / 2;
    if (clickDataSaver.use_rectangle) {
        minimal_y_half = clickDataSaver.minimal_height;
    } else if (clickDataSaver.use_circle) {
        minimal_y_half = clickDataSaver.radius;
    } else {
        minimal_y_half = clickDataSaver.radius_y;
    }
    minimal_y_half_grad = minimal_y_half + clickDataSaver.grad_radius;

    let heat_values: number[] = [];
    for (let i = 0; i < maxWidth * maxHeight; i++) {
        heat_values.push(0)
    }

    let minimal_width: number = maxWidth / 2;
    let minimal_height: number = minimal_y_half;

    for (let i = min; i <= max; i++) {

        const minimal_y_rect: number = buffer[i].get_y() - minimal_y_half;
        const maximal_y_rect: number = buffer[i].get_y() + minimal_y_half;
        const y_min = Math.max(buffer[i].get_y() - minimal_y_half_grad, 0);
        const y_max = Math.min(buffer[i].get_y() + minimal_y_half_grad, maxHeight);

        const minimal_x_rect: number = 0;
        const maximal_x_rect: number = maxWidth;
        const x_min = minimal_x_rect;
        const x_max = maximal_x_rect;


        let time = get_time(i);
        fillRectangleHelper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect, maximal_y_rect,
            minimal_width, minimal_height, clickDataSaver.grad_radius,
            x, buffer[i].get_y(), heat_values, time, maxWidth);
    }

    normalize_heat(heat_values);
    draw_heat(context, heat_values, maxWidth, maxHeight);
    context.fillStyle = "rgba(0,0,0,1)";
}

/**
 * a function to draw a heatmap which only uses the horizontal data of the coordinates
 *
 * @param context   the context where to draw on
 * @param min       the start index in the buffer
 * @param max       the end index in the buffer
 * @param buffer    the buffer with the coordinate data
 * @param maxWidth  the maxWidth where to draw the vertical heatmap
 * @param maxHeight the max height where to draw the horizontal heatmap
 */
export function drawHorizontalHeatMap(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], maxWidth: number, maxHeight: number) {
    let minimal_x_half: number;
    let minimal_x_half_grad: number;
    let y = maxHeight / 2;
    if (clickDataSaver.use_rectangle) {
        minimal_x_half = clickDataSaver.minimal_width;
    } else if (clickDataSaver.use_circle) {
        minimal_x_half = clickDataSaver.radius;
    } else {
        minimal_x_half = clickDataSaver.radius_x;
    }
    minimal_x_half_grad = minimal_x_half + clickDataSaver.grad_radius

    let heat_values: number[] = [];
    for (let i = 0; i < maxWidth * maxHeight; i++) {
        heat_values.push(0)
    }

    let minimal_width: number = minimal_x_half;
    let minimal_height: number = maxHeight / 2;

    for (let i = min; i <= max; i++) {

        const minimal_y_rect: number = 0;
        const maximal_y_rect: number = maxHeight;

        const y_min = minimal_y_rect;
        const y_max = maximal_y_rect;

        const minimal_x_rect: number = buffer[i].get_x() - minimal_x_half;
        const maximal_x_rect: number = buffer[i].get_x() + minimal_x_half;

        const x_min = Math.max(buffer[i].get_x() - minimal_x_half_grad, 0);
        const x_max = Math.min(buffer[i].get_x() + minimal_x_half_grad, maxWidth);

        let time = get_time(i);
        fillRectangleHelper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect, maximal_y_rect,
            minimal_width, minimal_height, clickDataSaver.grad_radius,
            buffer[i].get_x(), y, heat_values, time, maxWidth);

    }

    normalize_heat(heat_values);
    draw_heat(context, heat_values, maxWidth, maxHeight);
    context.fillStyle = "rgba(0,0,0,1)";
}