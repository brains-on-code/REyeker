from matplotlib import pyplot as plt
import matplotlib.image as mpimg
import numpy as np
import bresenham as bs


def get_alpha_blend(color, alpha, old_color):
    """

    :param color:       The color which should be blended upon the old color
    :param alpha:       The alpha value of the color
    :param old_color:   The old color
    :return:            The linear Interpolation between these color
    """

    r = alpha * color[0] + (1.0 - alpha) * old_color[0]
    g = alpha * color[1] + (1.0 - alpha) * old_color[1]
    b = alpha * color[2] + (1.0 - alpha) * old_color[2]

    return r, g, b


def draw_line(image, start, end, color, should_copy=False):
    """

    :param image:       the image data to manipulate
    :param start:       the start of the line as tuple (x,y)
    :param end:         the end of the line as tuple (x,y)
    :param color:       the color of the line as RGB tuple
    :param should_copy: Indicates if the image should be copied b4
    :return:            the image data to manipulate
    """
    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    data = list(bs.bresenham(start[1], start[0], end[1], end[0]))

    for coord in data:
        im[coord[0], coord[1]] = get_alpha_blend(color, color[3], im[coord[0], coord[1]])

    return im


def draw_rectangle(image, top_left, bottom_right, color, fill=False, should_copy=False):
    """

    :param image:           the image data to manipulate
    :param top_left:        top left corner as tuple (x,y)
    :param bottom_right:    bottom right corner as tuple (x,y)
    :param color:           the color of the line as RGB tuple
    :param fill:            if true fills the rectangle
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the image data to manipulate
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    if fill:
        for i in range(top_left[1], bottom_right[1]):
            im = draw_line(im, (top_left[0], i), (bottom_right[0], i), color)
    else:
        # horizontal top line
        im = draw_line(im, (top_left[0], top_left[1]), (bottom_right[0], top_left[1]), color)

        # horizontal bottom line
        im = draw_line(im, (top_left[0], bottom_right[1]), (bottom_right[0], bottom_right[1]), color)

        # left vertical
        im = draw_line(im, (top_left[0], top_left[1]), (top_left[0], bottom_right[1]), color)

        # right vertical
        im = draw_line(im, (bottom_right[0], top_left[1]), (bottom_right[0], bottom_right[1]), color)

    return im


def draw_letter(image, topleft, letter, should_copy=False):
    """

    :param image:       the image data to manipulate
    :param topleft:     start coordinate as tuple (x,y)
    :param letter:      the letter to draw (N, I, S, E) supported
    :param should_copy: Indicates if the image should be copied b4
    :return:            the image data to manipulate
    """

    if letter == "N":
        return draw_n(image, topleft, should_copy)
    if letter == "I":
        return draw_i(image, topleft, should_copy)
    if letter == "S":
        return draw_s(image, topleft, should_copy)
    if letter == "E":
        return draw_e(image, topleft, should_copy)
    return image


def draw_n(image, top_left, should_copy=False):
    """

    :param image:           image data to draw on
    :param top_left:        start coordinate as tuple (x,y)
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the new image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    color = (0, 0, 0, 1)

    x = top_left[0]
    y = top_left[1]

    im = draw_line(im, (x, y + 10), (x, y), color)
    im = draw_line(im, (x, y), (x + 8, y + 10), color)
    im = draw_line(im, (x + 8, y + 10), (x + 8, y), color)

    return im


def draw_i(image, top_left, should_copy=False):
    """

    :param image:           image data to draw on
    :param top_left:        start coordinate as tuple (x,y)
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the new image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    color = (0, 0, 0, 1)

    x = top_left[0]
    y = top_left[1]

    im = draw_line(im, (x, y), (x + 8, y), color)
    im = draw_line(im, (x + 4, y), (x + 4, y + 10), color)
    im = draw_line(im, (x, y + 10), (x + 8, y + 10), color)

    return im


def draw_s(image, top_left, should_copy=False):
    """

    :param image:           image data to draw on
    :param top_left:        start coordinate as tuple (x,y)
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the new image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    color = (0, 0, 0, 1)

    x = top_left[0]
    y = top_left[1]

    im = draw_line(im, (x + 8, y), (x, y), color)
    im = draw_line(im, (x, y), (x, y + 5), color)
    im = draw_line(im, (x, y + 5), (x + 8, y + 5), color)
    im = draw_line(im, (x + 8, y + 5), (x + 8, y + 10), color)
    im = draw_line(im, (x + 8, y + 10), (x, y + 10), color)

    return im


def draw_e(image, top_left, should_copy=False):
    """

    :param image:           image data to draw on
    :param top_left:        start coordinate as tuple (x,y)
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the new image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    color = (0, 0, 0, 1)

    x = top_left[0]
    y = top_left[1]

    im = draw_line(im, (x, y), (x, y + 10), color)
    im = draw_line(im, (x, y), (x + 8, y), color)
    im = draw_line(im, (x, y + 5), (x + 5, y + 5), color)
    im = draw_line(im, (x, y + 10), (x + 8, y + 10), color)

    return im
