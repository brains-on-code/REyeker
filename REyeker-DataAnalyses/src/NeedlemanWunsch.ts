let str = [];

/**
 * a function to return the minium value on the left, topleft, top of the current value, used for NW algorithm
 *
 * @param current_x     the current x value in respect to the matrix
 * @param current_y     the current y value in respect to the matrix
 * @param sequence_a    the sequence a which is currently encoded in the matrix
 * @param sequence_b    the sequence b which is currently encoded in the matrix
 * @param matrix        the matrix which is used of DP of the NW algorithm
 */
function getMin(current_x, current_y, sequence_a, sequence_b, matrix) {
    let topLeft = matrix[current_x - 1][current_y - 1];
    let left = matrix[current_x - 1][current_y] + 1;
    let top = matrix[current_x][current_y - 1] + 1;
    if (!(sequence_b[current_x - 1] === sequence_a[current_y - 1])) topLeft++;
    return Math.min(topLeft, left, top);
}


/**
 * a function to get the result of the NW matrix DP
 *
 * @param solution      where the solution will be stored
 * @param sequence_a    the sequence a which is currently encoded in the matrix
 * @param sequence_b    the sequence b which is currently encoded in the matrix
 * @param matrix        the matrix which is used of DP of the NW algorithm
 * @param x             the current value of the x backtrace
 * @param y             the current value of the y backtrace
 */
function backtrace(solution, sequence_a, sequence_b, matrix, x, y) {
    if (x === 0 && y === 0) {
        return;
    }
    if (x === 0) {
        str.push("top")
        solution.unshift({kind: "delete", data: sequence_b[y - 1]});
        return backtrace(solution, sequence_a, sequence_b, matrix, x, --y);
    }
    if (y === 0) {
        str.push("left")
        solution.unshift({kind: "insert", data: sequence_a[x - 1]});
        return backtrace(solution, sequence_a, sequence_b, matrix, --x, y);
    }

    if (matrix[y - 1][x - 1] <= matrix[y][x - 1] && matrix[y - 1][x - 1] <= matrix[y - 1][x]) {
        if (matrix[y][x] === matrix[y - 1][x - 1]) {
            str.push("keep")
            solution.unshift({kind: "keep", data: sequence_a[x - 1]});
            return backtrace(solution, sequence_a, sequence_b, matrix, --x, --y);
        }
    }
    if (matrix[y][x - 1] <= matrix[y - 1][x]) {
        str.push("left")
        solution.unshift({kind: "insert", data: sequence_a[x - 1]});
        return backtrace(solution, sequence_a, sequence_b, matrix, --x, y);
    } else {
        str.push("top");
        solution.unshift({kind: "delete", data: sequence_b[y - 1]});
        return backtrace(solution, sequence_a, sequence_b, matrix, x, --y);
    }
}


/**
 * returns a best fitting sequence of a and b
 *
 * @param sequence_a    the first sequence to analyse
 * @param sequence_b    the first sequence to analyse
 * @param sequence_b    the first sequence to analyse
 */
export function NeedlemanWunsch(sequence_a, sequence_b) {
    let matrix = [];
    for (let j = 0; j <= sequence_b.length; j++) {
        let tmp = [];
        for (let i = 0; i <= sequence_a.length; i++) {
            tmp.push(0)
        }
        matrix.push(tmp);
    }
    for (let j = 1; j <= sequence_b.length; j++) {
        matrix[j][0] = j;
    }
    for (let i = 0; i <= sequence_a.length; i++) {
        matrix[0][i] = i;
    }
    for (let j = 1; j <= sequence_b.length; j++) {
        for (let i = 1; i <= sequence_a.length; i++) {
            matrix[j][i] = getMin(j, i, sequence_a, sequence_b, matrix);
        }
    }

    let solution = [];

    str = [];
    backtrace(solution, sequence_a, sequence_b, matrix, sequence_a.length, sequence_b.length);
    return solution;
}