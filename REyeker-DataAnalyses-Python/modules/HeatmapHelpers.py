import colorsys
import math
import modules.drawing as drawing
import modules.utils as utils
import numpy as np


def to_index(width_idx, height_idx, max_width):
    return height_idx * max_width + width_idx


def get_time(idx, time_stamps):
    """
    returns a time value based on the time stamps and an idx

    :param idx:
    :param time_stamps:
    :return:
    """
    time = 1
    if time_stamps is not None and idx == len(time_stamps) - 1:
        average = sum(time_stamps)
        time = average / len(time_stamps)
    elif time_stamps is not None:
        time = time_stamps[idx + 1] - time_stamps[idx]
    return time


def normalize_heat(heat_values):
    """
    normalized the heat values to 0..1

    :param heat_values:
    :return:
    """
    max_val = max(heat_values)
    for count, value in enumerate(heat_values):
        heat_values[count] = value / max_val


def heat_map_color_for_value(value):
    """
    returns the color value for a 0-1. value

    :param value:
    :return:
    """
    h = ((1.0 - value) * 240.0) / 360.0
    return h, 1.0, 0.5, 0.5


def hsva2rgba(h, s, v, a):
    """
    hsva to rgba

    :param h:
    :param s:
    :param v:
    :param a:
    :return:
    """
    tup = colorsys.hsv_to_rgb(h, s, v)
    return tup[0], tup[1], tup[2], a


def draw_heat(image, heat_values):
    """
    draws heatmap to an image

    :param image:
    :param heat_values:
    :return:
    """
    max_width = image.shape[1]
    max_height = image.shape[0]
    for i in range(max_width):
        for j in range(max_height):
            idx = to_index(i, j, max_width)
            tup = heat_map_color_for_value(heat_values[idx])
            color = hsva2rgba(tup[0], tup[1], tup[2], tup[3])
            drawing.draw_point(image, (j, i), color)


def fill_rectangle_helper(x_min, x_max, y_min, y_max,
                          minimal_x_rect, maximal_x_rect,
                          minimal_y_rect, maximal_y_rect,
                          minimal_width, minimal_height, grad_radius,
                          x, y,
                          heat_values, time, max_width):
    """
    draws a rectangle heatmap onto a heat_values array

    :param x_min:
    :param x_max:
    :param y_min:
    :param y_max:
    :param minimal_x_rect:
    :param maximal_x_rect:
    :param minimal_y_rect:
    :param maximal_y_rect:
    :param minimal_width:
    :param minimal_height:
    :param grad_radius:
    :param x:
    :param y:
    :param heat_values:
    :param time:
    :param max_width:
    :return:
    """
    for i in range(int(x_min), int(x_max)):
        for j in range(int(y_min), int(y_max)):
            idx = to_index(i, j, max_width)
            if minimal_x_rect <= i <= maximal_x_rect and minimal_y_rect <= j <= maximal_y_rect:
                heat_values[idx] += time
            else:
                y_distance = math.sqrt(math.pow(y - j, 2.0))
                x_distance = math.sqrt(math.pow(x - i, 2.0))

                x_distance_norm = max(0.0, x_distance - minimal_width)
                x_distance_norm = max(0.0, x_distance_norm / grad_radius)

                y_distance_norm = max(0.0, y_distance - minimal_height)
                y_distance_norm = max(0.0, y_distance_norm / grad_radius)

                distance = min(1.0, x_distance_norm + y_distance_norm)
                alpha = 1.0 - distance
                heat_values[idx] += alpha * time


def fill_for_rectangle(heat_values, x, y, click_settings, max_width, max_height, time):
    """
    fills the heatmap using a rectangle

    :param heat_values:
    :param x:
    :param y:
    :param click_settings:
    :param max_width:
    :param max_height:
    :param time:
    :return:
    """
    minimal_x_rect = x - click_settings.minimal_width
    maximal_x_rect = x + click_settings.minimal_width
    minimal_y_rect = y - click_settings.minimal_height
    maximal_y_rect = y + click_settings.minimal_height

    x_min = max(x - click_settings.minimal_width - click_settings.grad_radius, 0.0)
    x_max = min(x + click_settings.minimal_width + click_settings.grad_radius, max_width)
    y_min = max(y - click_settings.minimal_height - click_settings.grad_radius, 0.0)
    y_max = min(y + click_settings.minimal_height + click_settings.grad_radius, max_height)

    fill_rectangle_helper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect, maximal_y_rect,
                          click_settings.minimal_width, click_settings.minimal_height, click_settings.grad_radius,
                          x, y, heat_values, time, max_width)


def fill_for_ellipse(heat_values, x, y, click_settings, max_width, max_height, time):
    """
    fill the heatmap using a ellipse

    :param heat_values:
    :param x:
    :param y:
    :param click_settings:
    :param max_width:
    :param max_height:
    :param time:
    :return:
    """
    x_min = max(x - click_settings.x_radius - click_settings.grad_radius, 0.0)
    x_max = min(x + click_settings.x_radius + click_settings.grad_radius, max_width)

    y_min = max(y - click_settings.y_radius - click_settings.grad_radius, 0.0)
    y_max = min(y + click_settings.y_radius + click_settings.grad_radius, max_height)

    x_rad_square = math.pow(click_settings.x_radius, 2.0)
    y_rad_square = math.pow(click_settings.y_radius, 2.0)

    x_rad_grad_square = math.pow(click_settings.x_radius + click_settings.grad_radius, 2.0)
    y_rad_grad_square = math.pow(click_settings.y_radius + click_settings.grad_radius, 2.0)

    for height_iter in range(int(y_min), int(y_max)):
        for width_iter in range(int(x_min), int(x_max)):
            clear = math.pow(width_iter - x, 2.0) / x_rad_square + math.pow(height_iter - y, 2.0) / y_rad_square <= 1.0
            inter_value = math.pow(width_iter - x, 2.0) / x_rad_grad_square + math.pow(height_iter - y,
                                                                                       2.0) / y_rad_grad_square
            interpolate = inter_value <= 1.0

            idx = to_index(width_iter, height_iter, max_width)

            if clear:
                heat_values[idx] += time
            elif interpolate and click_settings.grad_radius != 0:
                x_distance = math.fabs(x - width_iter)
                y_distance = math.fabs(y - height_iter)

                x_distance_norm = max(0.0, x_distance - click_settings.x_radius)
                x_distance_norm = max(0.0, x_distance_norm / click_settings.grad_radius)

                y_distance_norm = max(0.0, y_distance - click_settings.y_radius)
                y_distance_norm = max(0.0, y_distance_norm / click_settings.grad_radius)

                distance = min(1.0, math.sqrt(math.pow(x_distance_norm, 2.0) + math.pow(y_distance_norm, 2.0)))
                alpha = 1.0 - distance

                heat_values[idx] += alpha * time


def fill_for_circle(heat_values, x, y, click_settings, max_width, max_height, time):
    """
    fill the heatvalues based on the circle

    :param heat_values:
    :param x:
    :param y:
    :param click_settings:
    :param max_width:
    :param max_height:
    :param time:
    :return:
    """
    x_min = max(x - click_settings.radius - click_settings.grad_radius, 0.0)
    x_max = min(x + click_settings.radius + click_settings.grad_radius, max_width - 1)

    y_min = max(y - click_settings.radius - click_settings.grad_radius, 0.0)
    y_max = min(y + click_settings.radius + click_settings.grad_radius, max_height - 1)

    rad_square = math.pow(click_settings.radius, 2.0)
    rad_grad_square = math.pow(click_settings.radius + click_settings.grad_radius, 2.0)
    for height_iter in range(int(y_min), int(y_max)):
        for width_iter in range(int(x_min), int(x_max)):
            clear = math.pow(width_iter - x, 2.0) + math.pow(height_iter - y, 2.0) <= rad_square
            inter_value = math.pow(width_iter - x, 2.0) + math.pow(height_iter - y, 2.0)
            interpolate = inter_value <= rad_grad_square

            idx = to_index(width_iter, height_iter, max_width)
            if clear:
                heat_values[idx] += time
            elif interpolate and click_settings.grad_radius != 0:
                x_distance = math.fabs(x - width_iter)
                y_distance = math.fabs(y - height_iter)

                x_distance_norm = max(0.0, x_distance - click_settings.radius)
                x_distance_norm = max(0.0, x_distance_norm / click_settings.grad_radius)

                y_distance_norm = max(0.0, y_distance - click_settings.radius)
                y_distance_norm = max(0.0, y_distance_norm / click_settings.grad_radius)

                distance = min(1.0, math.sqrt(math.pow(x_distance_norm, 2.0) + math.pow(y_distance_norm, 2.0)))
                alpha = 1.0 - distance

                heat_values[idx] += alpha * time


def draw_average_heat_map_abs(image, coordinates_array, click_settings, time_stamps_array, upper, lower):
    """
    a function to draw a heatmap based on the
    :param upper:
    :param lower:
    :param image:
    :param coordinates_array:
    :param click_settings:
    :param time_stamps_array:
    :return:
    """

    click_settings.add_grad_radius_to_shape()

    max_width = image.shape[1]
    max_height = image.shape[0]

    heat_values = []
    for i in range(max_width * max_height):
        heat_values.append(0.0)

    for idx in range(len(coordinates_array)):
        coordinates = coordinates_array[idx]
        time_stamps = utils.get_element_or_none(time_stamps_array, idx)
        min_idx = 0
        max_idx = len(coordinates)

        if click_settings.use_rectangle:
            for i in range(min_idx, max_idx):
                time = get_time(i, time_stamps)
                fill_for_rectangle(heat_values, coordinates[i][0], coordinates[i][1], click_settings, max_width,
                                   max_height,
                                   time)
        elif click_settings.use_circle:
            for i in range(min_idx, max_idx):
                time = get_time(i, time_stamps)
                fill_for_circle(heat_values, coordinates[i][0], coordinates[i][1], click_settings, max_width,
                                max_height,
                                time)
        elif click_settings.use_ellipse:
            for i in range(min_idx, max_idx):
                time = get_time(i, time_stamps)
                fill_for_ellipse(heat_values, coordinates[i][0], coordinates[i][1], click_settings, max_width,
                                 max_height,
                                 time)

    heat_values = np.array(heat_values)
    max = np.unique(np.sort(heat_values.flatten()))[-1]
    low = max * lower
    high = max * upper
    heat_values[heat_values < low] = 0.0
    heat_values[heat_values > high] = 0.0

    heat_values = heat_values.tolist()

    normalize_heat(heat_values)
    draw_heat(image, heat_values)

    click_settings.reset_grad_radius_to_shape()

    return heat_values


def draw_average_heat_map_rel(image, coordinates_array, click_settings, time_stamps_array, upper, lower):
    """
    a function to draw a heatmap based on the
    :param upper:
    :param lower:
    :param image:
    :param coordinates_array:
    :param click_settings:
    :param time_stamps_array:
    :return:
    """

    click_settings.add_grad_radius_to_shape()

    max_width = image.shape[1]
    max_height = image.shape[0]

    heat_values_array = []

    for idx in range(len(coordinates_array)):

        heat_values = []
        for i in range(max_width * max_height):
            heat_values.append(0.0)

        coordinates = coordinates_array[idx]
        time_stamps = utils.get_element_or_none(time_stamps_array, idx)
        min_idx = 0
        max_idx = len(coordinates)

        if click_settings.use_rectangle:
            for i in range(min_idx, max_idx):
                time = get_time(i, time_stamps)
                fill_for_rectangle(heat_values, coordinates[i][0], coordinates[i][1], click_settings, max_width,
                                   max_height,
                                   time)
        elif click_settings.use_circle:
            for i in range(min_idx, max_idx):
                time = get_time(i, time_stamps)
                fill_for_circle(heat_values, coordinates[i][0], coordinates[i][1], click_settings, max_width,
                                max_height,
                                time)
        elif click_settings.use_ellipse:
            for i in range(min_idx, max_idx):
                time = get_time(i, time_stamps)
                fill_for_ellipse(heat_values, coordinates[i][0], coordinates[i][1], click_settings, max_width,
                                 max_height,
                                 time)

        heat_values_array.append(heat_values)


    final_heat = []
    for i in range(max_width * max_height):
        final_heat.append(0.0)

    for heat_values in heat_values_array:
        for i in range(max_width * max_height):
            final_heat[i] += heat_values[i]

    normalize_heat(final_heat)
    final_heat = [(lower <= h <= upper)*h for h in final_heat]
    draw_heat(image, final_heat)

    click_settings.reset_grad_radius_to_shape()

    return heat_values


def draw_shape_heat_map(image, min_idx, max_idx, coordinates, click_settings, time_stamps):
    """
    :param time_stamps:     value for timestamps if it should be used
    :param image:           the image data to work with
    :param min_idx:         the index where to start drawing the heatmap
    :param max_idx:         the index where to stop drawing the heatmap exclusive
    :param coordinates:     an array of coordinates (x,y)
    :param click_settings:  the click Settings of the Image
    :return:                the modified image data
    """

    max_width = image.shape[1]
    max_height = image.shape[0]

    heat_values = []
    for i in range(max_width * max_height):
        heat_values.append(0.0)

    if click_settings.use_rectangle:
        for i in range(min_idx, max_idx):
            time = get_time(i, time_stamps)
            fill_for_rectangle(heat_values, coordinates[i][0], coordinates[i][1], click_settings, max_width, max_height,
                               time)
    elif click_settings.use_circle:
        for i in range(min_idx, max_idx):
            time = get_time(i, time_stamps)
            fill_for_circle(heat_values, coordinates[i][0], coordinates[i][1], click_settings, max_width, max_height,
                            time)
    elif click_settings.use_ellipse:
        for i in range(min_idx, max_idx):
            time = get_time(i, time_stamps)
            fill_for_ellipse(heat_values, coordinates[i][0], coordinates[i][1], click_settings, max_width, max_height,
                             time)

    normalize_heat(heat_values)
    draw_heat(image, heat_values)


def draw_vertical_heatmap(image, min_idx, max_idx, coordinates, times, click_settings):
    """
    draws a vertical heat map

    :param image:
    :param min_idx:
    :param max_idx:
    :param coordinates:
    :param times:
    :param click_settings:
    :return:
    """
    max_width = image.shape[1]
    max_height = image.shape[0]

    minimal_y_half = 0.0
    x = max_width / 2.0

    if click_settings.use_rectangle:
        minimal_y_half = click_settings.minimal_height
    elif click_settings.use_circle:
        minimal_y_half = click_settings.radius
    elif click_settings.use_ellipse:
        minimal_y_half = click_settings.y_radius

    minimal_y_half_grad = minimal_y_half + click_settings.grad_radius

    heat_values = []
    for i in range(max_width * max_height):
        heat_values.append(0.0)

    minimal_width = max_width / 2.0
    minimal_height = minimal_y_half

    for i in range(min_idx, max_idx + 1):
        minimal_y_rect = coordinates[i][1] - minimal_y_half
        maximal_y_rect = coordinates[i][1] + minimal_y_half

        y_min = max(0.0, coordinates[i][1] - minimal_y_half_grad)
        y_max = min(max_height, coordinates[i][1] + minimal_y_half_grad)

        minimal_x_rect = 0.0
        maximal_x_rect = max_width

        x_min = minimal_x_rect
        x_max = maximal_x_rect

        time = get_time(i, times)
        fill_rectangle_helper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect,
                              maximal_y_rect,
                              minimal_width, minimal_height, click_settings.grad_radius,
                              x, coordinates[i][1], heat_values, time, max_width)


def draw_horizontal_heatmap(image, min_idx, max_idx, coordinates, times, click_settings):
    """
    draws a horizontal heat map

    :param image:
    :param min_idx:
    :param max_idx:
    :param coordinates:
    :param times:
    :param click_settings:
    :return:
    """
    max_width = image.shape[1]
    max_height = image.shape[0]

    minimal_x_half = 0.0
    y = max_height / 2.0

    if click_settings.use_rectangle:
        minimal_x_half = click_settings.minimal_width
    elif click_settings.use_circle:
        minimal_x_half = click_settings.radius
    elif click_settings.use_ellipse:
        minimal_x_half = click_settings.x_radius

    minimal_x_half_grad = minimal_x_half + click_settings.grad_radius

    heat_values = []
    for i in range(max_width * max_height):
        heat_values.append(0.0)

    minimal_width = minimal_x_half
    minimal_height = max_height / 2.0

    for i in range(min_idx, max_idx + 1):
        minimal_y_rect = 0
        maximal_y_rect = max_height

        y_min = minimal_y_rect
        y_max = maximal_y_rect

        minimal_x_rect = coordinates[i][0] - minimal_x_half
        maximal_x_rect = coordinates[i][0] + minimal_x_half

        x_min = max(0.0, coordinates[i][0] - minimal_x_half_grad)
        x_max = max(max_width, coordinates[i][0] + minimal_x_half_grad)

        time = get_time(i, times)
        fill_rectangle_helper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect,
                              maximal_y_rect,
                              minimal_width, minimal_height, click_settings.grad_radius,
                              coordinates[i][0], y, heat_values, time, max_width)
