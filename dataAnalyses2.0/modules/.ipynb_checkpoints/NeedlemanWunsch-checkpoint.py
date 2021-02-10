def get_min(current_x, current_y, sequence_a, sequence_b, matrix):
    """

    :param current_x:   the current x value in respect to the matrix
    :param current_y:   the current y value in respect to the matrix
    :param sequence_a:  the sequence a which is currently encoded in the matrix
    :param sequence_b:  the sequence b which is currently encoded in the matrix
    :param matrix:      the matrix which is used of DP of the NW algorithm
    :return:            the minimum of the values
    """

    top_left = matrix[current_x - 1][current_y - 1]
    left = matrix[current_x - 1][current_y] + 1
    top = matrix[current_x][current_y - 1] + 1
    if sequence_b[current_x - 1] != sequence_a[current_y - 1]:
        top_left += 1
    return min(top_left, left, top)


def backtrace(solution, sequence_a, sequence_b, matrix, x, y, str_res):
    """

    :param solution:       where the solution will be stored array of strings
    :param sequence_a:     the sequence a which is currently encoded in the matrix
    :param sequence_b:     the sequence b which is currently encoded in the matrix
    :param matrix:         the matrix which is used of DP of the NW algorithm
    :param x:              the current value of the x backtrace
    :param y:              the current value of the y backtrace
    :param str_res:        the result string
    :return:               nothing, all happens with side effects
    """

    if x == 0 and y == 0:
        return
    if x == 0:
        str_res.append("top")
        solution.insert(0, {"kind": "delete", "data": int(sequence_b[y - 1])})
        y = y - 1
        return backtrace(solution, sequence_a, sequence_b, matrix, x, y, str_res)
    if y == 0:
        str_res.append("left")
        solution.insert(0, {"kind": "insert", "data": int(sequence_a[x - 1])})
        x = x - 1
        return backtrace(solution, sequence_a, sequence_b, matrix, x, y, str_res)
    if matrix[y - 1][x - 1] <= matrix[y][x - 1] and matrix[y - 1][x - 1] <= matrix[y - 1][x]:
        if matrix[y][x] == matrix[y - 1][x - 1]:
            str_res.append("keep")
            solution.insert(0, {"kind": "keep", "data": int(sequence_a[x - 1])})
            x = x - 1
            y = y - 1
            return backtrace(solution, sequence_a, sequence_b, matrix, x, y, str_res)
    if matrix[y][x - 1] <= matrix[y - 1][x]:
        str_res.append("left")
        solution.insert(0, {"kind": "insert", "data": int(sequence_a[x - 1])})
        x = x - 1
        return backtrace(solution, sequence_a, sequence_b, matrix, x, y, str_res)
    else:
        str_res.append("top")
        solution.insert(0, {"kind": "delete", "data": int(sequence_b[y - 1])})
        y = y - 1
        return backtrace(solution, sequence_a, sequence_b, matrix, x, y, str_res)


def needleman_wunsch(sequence_a, sequence_b):
    """

    :param sequence_a:  The sequence to analyse
    :param sequence_b:  The sequence to analyse with
    :return:            minimal bets fitting overlay
    """
    matrix = []
    for j in range(0, len(sequence_b)+1):
        tmp = [0]*(len(sequence_a)+1)
        matrix.append(tmp)

    for j in range(1, len(sequence_b)+1):
        matrix[j][0] = j

    for i in range(1, len(sequence_a)+1):
        matrix[0][i] = i

    for j in range(1, len(sequence_b)+1):
        for i in range(1, len(sequence_a)+1):
            matrix[j][i] = get_min(j, i, sequence_a, sequence_b, matrix)

    solution = []
    str_res = []
    backtrace(solution, sequence_a, sequence_b, matrix, len(sequence_a), len(sequence_b), str_res)
    return solution


def round_with_offset(offset, rounding, value):
    """

    :param offset:      offset for the first rounding value
    :param rounding:    rounding value
    :param value:       the value which to round
    :return:            the rounded value
    """

    tmp1 = value
    tmp2 = tmp1 % rounding
    tmp3 = (tmp1 - tmp2) + offset
    return tmp3


def to_usable_buffer(solution_buffer, use_deleted=True):
    """

    :param solution_buffer: buffer which will be filtered
    :param use_deleted:     use the deleted to display
    :return:                return the filtered buffer
    """

    usable_buffer = []
    for i in range(0, len(solution_buffer)):
        if not use_deleted and solution_buffer[i]["kind"] == "delete":
            continue
        usable_buffer.append(solution_buffer[i]["data"])
    return usable_buffer


def get_color(kind):
    """

    :param kind:    kind of the node in respect to NW algorithm
    :return:        the color
    """

    if kind == "delete":
        return 1, 0, 0, 1
    if kind == "insert":
        return 0, 1, 0, 1
    if kind == "missmatch":
        return 0, 0, 1, 1
    return 0, 0, 0, 1


