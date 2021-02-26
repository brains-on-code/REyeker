import {Coordinate} from "./Coordinate";
import {NeedlemanWunsch} from "./NeedlemanWunsch";

/**
 * round a number based on a rounding value and an offset
 *
 * @param offset
 * @param rounding
 * @param value
 */
function roundWithOffset(offset: number, rounding: number, value: number) {
    const tmp1 = value;
    const tmp2 = tmp1 % rounding;
    const tmp3 = (tmp1 - tmp2) + offset;
    return tmp3;
}

/**
 * finishes up the solution by (currently coping all values, delete scould be inserted)
 *
 * @param solution_buffer
 * @param useDeleted
 */
function toUseableBuffer(solution_buffer, useDeleted=true){
    let usable_buffer = [];
    for(let i=0; i<solution_buffer.length; i++){
        if(useDeleted==false && solution_buffer[i].kind === "delete"){
            continue;
        }
        usable_buffer.push(solution_buffer[i].data);
    }
    return usable_buffer;
}

/**
 * returns a color based on the result of the NW
 *
 * @param kind      the value of the result
 */
function getColor(kind: string) {
    if (kind === "delete") return {r: 255, g: 0, b: 0};
    if (kind === "insert") return {r: 0, g: 255, b: 0};
    if (kind === "missmatch") return {r: 0, g: 0, b: 255};
    return {r: 0, g: 0, b: 0};
}

/**
 * sets a color to the context
 *
 * @param context       the context to set the color on
 * @param color         the color to set
 */
function setColor(context: CanvasRenderingContext2D, color) {
    context.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * calculates and draws the vertical needleman wunsch line diagramm
 *
 * @param context       the context to draw on
 * @param rounding      the rounfing value
 * @param width         the max width
 * @param buffer_a      a buffer to compare to
 * @param buffer_b      a buffer to compare to
 */
export function drawVerticalNeedlemanWunschLineDiagram(context: CanvasRenderingContext2D, rounding: number, width: number, buffer_a: Coordinate[], buffer_b: Coordinate[]) {

    let buffer_needle_a = [];
    let buffer_needle_b = [];
    let rounding_half = rounding / 2.0;

    for (let i = 0; i < buffer_a.length; i++) {
        buffer_needle_a.push(roundWithOffset(rounding_half, rounding, buffer_a[i].get_y()));
    }

    for (let i = 0; i < buffer_b.length; i++) {
        buffer_needle_b.push(roundWithOffset(rounding_half, rounding, buffer_b[i].get_y()));
    }
    let buffer = NeedlemanWunsch(buffer_needle_a, buffer_needle_b);

    let current_x: number = width;

    let color = {r: 0, g: 0, b: 0};
    /* to show the sequence of the needleman wunsch, not that intersting but works
    for (let i = 1; i < buffer.length; i++) {

        context.beginPath();

        color = getColor(buffer[i].kind);
        setColor(context, color);

        context.moveTo(current_x, buffer[i - 1].data);
        context.lineTo(current_x, buffer[i].data);
        current_x -= 3;
        context.lineTo(current_x, buffer[i].data);

        context.stroke();
    }
    */

    current_x = 3;

    context.beginPath();
    context.moveTo(current_x, buffer[0].data);

    setColor(context, {r: 0, g: 0, b: 0});
    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i].kind === "delete" || buffer[i].kind === "missmatch") {
            continue;
        }
        context.lineTo(current_x, buffer[i].data);
        current_x += 3;
        context.lineTo(current_x, buffer[i].data);
    }
    context.stroke();

}

/**
 * calculates and draws the vertical horizontal wunsch line diagramm
 *
 * @param context       the context to draw on
 * @param rounding      the rounfing value
 * @param height        the max height
 * @param buffer_a      a buffer to compare to
 * @param buffer_b      a buffer to compare to
 */
export function drawHorizontalNeedlemanWunschLineDiagram(context: CanvasRenderingContext2D, rounding: number, height: number, buffer_a: Coordinate[], buffer_b: Coordinate[]) {

    let buffer_needle_a = [];
    let buffer_needle_b = [];
    let rounding_half = rounding / 2.0;

    for (let i = 0; i < buffer_a.length; i++) {
        buffer_needle_a.push(roundWithOffset(rounding_half, rounding, buffer_a[i].get_x()));
    }

    for (let i = 0; i <= buffer_b.length; i++) {
        buffer_needle_b.push(roundWithOffset(rounding_half, rounding, buffer_b[i].get_x()));
    }

    let buffer = NeedlemanWunsch(buffer_needle_a, buffer_needle_b);

    let current_y: number = height;

    let color = {r: 0, g: 0, b: 0};
    for (let i = 1; i < buffer.length; i++) {

        context.beginPath();

        color = getColor(buffer[i].kind);
        setColor(context, color);

        context.moveTo(buffer[i - 1].data, current_y);
        context.lineTo(buffer[i].data, current_y);
        current_y -= 3;
        context.lineTo(buffer[i].data, current_y);

        context.stroke();
    }

    current_y = 3;

    context.beginPath();
    context.moveTo(0, current_y);

    setColor(context, {r: 0, g: 0, b: 0});
    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i].kind === "delete" || buffer[i].kind === "missmatch") {
            continue;
        }
        context.lineTo(buffer[i].data, current_y);
        current_y += 3;
        context.lineTo(buffer[i].data, current_y);
    }
    context.stroke();
}


/**
 * calculates and draws the combined vertical horizontal wunsch line diagramm
 *
 * @param context       the context to draw on
 * @param rounding      the rounding value
 * @param buffers       the buffers to compare to
 */
export function drawVerticalCNWLineDiagram(context: CanvasRenderingContext2D, rounding: number, buffers) {

    let buffers_needle = [];
    let rounding_half = rounding / 2.0;


    for (let i = 0; i < buffers.length; i++) {
        let tmp_buffer = [];
        for (let j = 0; j < buffers[i].length; j++) {
            tmp_buffer.push(roundWithOffset(rounding_half, rounding, buffers[i][j].get_y()));
        }
        buffers_needle.push(tmp_buffer);
    }

    let current_sol = buffers_needle[0];
    for(let i=1; i<buffers_needle.length; i++){
        let sol_buffer = NeedlemanWunsch(buffers_needle[i], current_sol);
        current_sol = toUseableBuffer(sol_buffer, false);
    }


    let buffer = current_sol;
    let current_x = 3;

    context.beginPath();
    context.moveTo(current_x, buffer[0].data);

    setColor(context, {r: 0, g: 0, b: 0});
    for (let i = 0; i < buffer.length; i++) {
        context.lineTo(current_x, buffer[i]);
        current_x += 3;
        context.lineTo(current_x, buffer[i]);
    }
    context.stroke();

}

/**
 * calculates and draws the combined horizontal horizontal wunsch line diagramm
 *
 * @param context       the context to draw on
 * @param rounding      the rounding value
 * @param buffers       the buffers to compare to
 */
export function drawHorizontalCNWLineDiagram(context: CanvasRenderingContext2D, rounding: number, buffers) {

    let rounding_half = rounding / 2.0;

    let buffers_needle = [];

    for (let i = 0; i < buffers.length; i++) {
        let tmp_buffer = [];
        for (let j = 0; j < buffers[i].length; j++) {
            tmp_buffer.push(roundWithOffset(rounding_half, rounding, buffers[i][j].get_x()));
        }
        buffers_needle.push(tmp_buffer);
    }

    let current_sol = buffers_needle[0];
    for(let i=1; i<buffers_needle.length; i++){
        let sol_buffer = NeedlemanWunsch(buffers_needle[i], current_sol);
        current_sol = toUseableBuffer(sol_buffer);
    }


    let buffer = current_sol;
    let current_y = 3;

    context.beginPath();
    context.moveTo(buffer[0].data, current_y);

    setColor(context, {r: 0, g: 0, b: 0});
    for (let i = 0; i < buffer.length; i++) {

        context.lineTo(buffer[i], current_y);
        current_y += 3;
        context.lineTo(buffer[i], current_y);
    }
    context.stroke();

}
