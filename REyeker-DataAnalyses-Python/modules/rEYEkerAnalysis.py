from matplotlib import pyplot as plt
import matplotlib.image as mpimg
import modules.drawing as drw
import modules.NeedlemanWunsch as nw
import modules.clickSettings as clk
import modules.semanticClassifier as semCls
import json
import numpy as np


def load_image(path):
    """

    :param path:    the path to the image, which should be loaded
    :return:        returns a 2D rgb array for the image data
    """
    return mpimg.imread(path)


def display(image, normal_size=True, axis_on=True):
    """

    :param image:           The Image data which should be displayed as 2d rgb array
    :param normal_size:     should display the image in normal or downsclaed size
    :param axis_on:         should display the axis to the image
    """
    if normal_size:
        width = image.shape[1]
        height = image.shape[0]
        margin = 0
        dpi = 100.

        figsize = ((width + 2 * margin) / dpi, (height + 2 * margin) / dpi)  # inches
        left = margin / dpi / figsize[0]  # axes ratio
        bottom = margin / dpi / figsize[1]

        fig = plt.figure(figsize=figsize, dpi=dpi)
        fig.subplots_adjust(left=left, bottom=bottom, right=1. - left, top=1. - bottom)

    if axis_on:
        plt.axis("on")
    else:
        plt.axis("off")

    plt.imshow(image)
    plt.show()


def load_semantic_classifier_from_json(path):
    """

    :param path:    the path and name to the json file
    :return:        a semantic classifier Object
    """
    file = open(path)
    data_dic = json.load(file)

    semantic_classifier_dict_list = data_dic["semanticClassifier"]
    semantic_classifier_tuple = []
    for field in semantic_classifier_dict_list:
        top = field["top"]
        bot = field["bot"]
        classifier = field["classifier"]
        semantic_classifier_tuple.append((top, bot, classifier))

    semantic_classifier = semCls.SemanticClassifier(semantic_classifier_tuple[-1][1])
    semantic_classifier.load_from_tuples(semantic_classifier_tuple)

    return semantic_classifier


def load_data_from_json(path):
    """

    :param path:    the path and name to the json file
    :return:        a tuple with (array of array of coordinates (x,y), clickSettings)
    """

    file = open(path)
    data_dic = json.load(file)

    click_settings = clk.ClickSettings(data_dic["grad_radius"], data_dic["minimal_width"], data_dic["minimal_height"])
    click_data_str = data_dic["data"]

    click_data = []
    for dataset in click_data_str:
        coordinates_str = dataset.split(" ")
        coordinates = []
        for coordinate_str in coordinates_str:
            coordinate = coordinate_str.split("-")
            coordinate = (int(coordinate[0]), int(coordinate[1]))
            coordinates.append(coordinate)
        click_data.append(coordinates)

    return click_data, click_settings


def save_data_to_json(path, click_settings, coordinate_buffers):
    """
    :param path:                the path and name of the file to write
    :param click_settings:      the click settings which will be saved
    :param coordinate_buffers:  a array of array of coordinates
    :return:                    nothing
    """

    data_dict = {
        "grad_radius": click_settings.grad_radius,
        "minimal_width": click_settings.minimal_width,
        "minimal_height": click_settings.minimal_height
    }

    data = []
    for coordinate_buffer in coordinate_buffers:
        tmp = [str(x) + "-" + str(y) for (x, y) in coordinate_buffer]
        coordinate_str = " ".join(tmp)
        data.append(coordinate_str)

    data_dict["data"] = data

    data_str = json.dumps(data_dict)

    file = open(path, "w")
    file.write(data_str)
    file.close()


def draw_rectangle_view(image, coordinate, click_settings, should_copy=False):
    """

    :param image:           the image data to work on
    :param coordinate:      the coordinate where to draw around as tuple (x,y)
    :param click_settings:  the clickSettings
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the manipulated image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    x = coordinate[0]
    y = coordinate[1]

    minimal_x_half = click_settings.minimal_width + click_settings.grad_radius
    minimal_y_half = click_settings.minimal_height + click_settings.grad_radius

    im = drw.draw_rectangle(im,
                            (max(0, x - minimal_x_half), max(0, y - minimal_y_half)),
                            (min(x + minimal_x_half, image.shape[1] - 1), min(y + minimal_y_half, image.shape[0] - 1)),
                            (0, 0, 0, 1))

    return im


def draw_line_view(image, coordinate, click_settings, should_copy=False):
    """

    :param image:           the image data to work on
    :param coordinate:      the coordinate where to draw around as tuple (x,y)
    :param click_settings:  the clickSettings
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the manipulated image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    y = coordinate[1]

    minimal_y_half = click_settings.minimal_height + click_settings.grad_radius

    im = drw.draw_line(im,
                       (0, max(0, y - minimal_y_half)),
                       (image.shape[1] - 1, max(0, y - minimal_y_half)),
                       (0, 0, 0, 1))

    im = drw.draw_line(im,
                       (0, min(image.shape[0] - 1, y + minimal_y_half)),
                       (image.shape[1] - 1, min(image.shape[0] - 1, y + minimal_y_half)),
                       (0, 0, 0, 1))

    return im


def draw_row_view(image, coordinate, click_settings, should_copy=False):
    """

    :param image:           the image data to work on
    :param coordinate:      the coordinate where to draw around as tuple (x,y)
    :param click_settings:  the clickSettings
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the manipulated image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    x = coordinate[0]

    minimal_x_half = click_settings.minimal_width + click_settings.grad_radius

    im = drw.draw_line(im,
                       (max(0, x - minimal_x_half), 0),
                       (max(0, x - minimal_x_half), image.shape[0] - 1),
                       (0, 0, 0, 1))
    im = drw.draw_line(im,
                       (min(image.shape[1] - 1, x + minimal_x_half), 0),
                       (min(image.shape[1] - 1, x + minimal_x_half), image.shape[0] - 1),
                       (0, 0, 0, 1))

    return im


def draw_rectangle_heat_map(image, min_idx, max_idx, coordinates, click_settings, base_color=(0, 1, 0),
                            should_copy=False):
    """
    :param image:           the image data to work with
    :param min_idx:         the index where to start drawing the heatmap
    :param max_idx:         the index where to stop drawing the heatmap exclusive
    :param coordinates:     an array of coordinates (x,y)
    :param click_settings:  the click Settings of the Image
    :param base_color:      the base color for the index
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the modified image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    min_idx = max(0, min_idx)

    if max_idx < min_idx:
        max_idx = min_idx + 1
    max_idx = min(len(coordinates), max_idx)

    minimal_x_half = click_settings.minimal_width + click_settings.grad_radius
    minimal_y_half = click_settings.minimal_height + click_settings.grad_radius

    alpha = 0.9 / (max_idx - min_idx)
    color = (base_color[0], base_color[1], base_color[2], alpha)

    for i in range(min_idx, max_idx):
        x = coordinates[i][0]
        y = coordinates[i][1]
        im = drw.draw_rectangle(im,
                                (max(0, x - minimal_x_half), max(0, y - minimal_y_half)),
                                (min(image.shape[1] - 1, x + minimal_x_half),
                                 min(image.shape[0] - 1, y + minimal_y_half)),
                                color, True)

    return im


def draw_vertical_heat_map(image, min_idx, max_idx, coordinates, click_settings, base_color=(1, 0, 0),
                           should_copy=False):
    """
    :param image:           the image data to work with
    :param min_idx:         the index where to start drawing the heatmap
    :param max_idx:         the index where to stop drawing the heatmap exclusive
    :param coordinates:     an array of coordinates (x,y)
    :param click_settings:  the click Settings of the Image
    :param base_color:      the base color for the index
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the modified image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    min_idx = max(0, min_idx)

    if max_idx < min_idx:
        max_idx = min_idx + 1
    max_idx = min(len(coordinates), max_idx)

    minimal_y_half = click_settings.minimal_height + click_settings.grad_radius

    alpha = 0.9 / (max_idx - min_idx)
    color = (base_color[0], base_color[1], base_color[2], alpha)

    for i in range(min_idx, max_idx):
        y = coordinates[i][1]
        im = drw.draw_rectangle(im,
                                (0, max(0, y - minimal_y_half)),
                                (image.shape[1] - 1, min(image.shape[1] - 1, y + minimal_y_half)),
                                color, True)

    return im


def draw_horizontal_heat_map(image, min_idx, max_idx, coordinates, click_settings, base_color=(0, 0, 1),
                             should_copy=False):
    """
    :param image:           the image data to work with
    :param min_idx:         the index where to start drawing the heatmap
    :param max_idx:         the index where to stop drawing the heatmap exclusive
    :param coordinates:     an array of coordinates (x,y)
    :param click_settings:  the click Settings of the Image
    :param base_color:      the base color for the index
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the modified image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    min_idx = max(0, min_idx)

    if max_idx < min_idx:
        max_idx = min_idx + 1
    max_idx = min(len(coordinates), max_idx)

    minimal_x_half = click_settings.minimal_width + click_settings.grad_radius

    alpha = 0.9 / (max_idx - min_idx)
    color = (base_color[0], base_color[1], base_color[2], alpha)

    for i in range(min_idx, max_idx):
        x = coordinates[i][0]
        im = drw.draw_rectangle(im,
                                (max(0, x - minimal_x_half), 0),
                                (min(image.shape[1] - 1, x + minimal_x_half), image.shape[0] - 1),
                                color, True)

    return im


def draw_vertical_line_diagram(image, min_idx, max_idx, coordinates, should_copy=False):
    """
    :param image:           the image data to work with
    :param min_idx:         the index where to start drawing the heatmap
    :param max_idx:         the index where to stop drawing the heatmap exclusive
    :param coordinates:     an array of coordinates (x,y)
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the modified image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    min_idx = max(0, min_idx)

    if max_idx < min_idx:
        max_idx = min_idx + 1
    max_idx = min(len(coordinates), max_idx)

    # a number to start, 3 otherwise would overlap with the start
    current_x = 3
    current_y = coordinates[min_idx][1]

    for i in range(min_idx, max_idx):
        y = coordinates[i][1]
        im = drw.draw_line(im, (current_x, current_y), (current_x, y), (0, 0, 0, 1))
        current_y = y
        im = drw.draw_line(im, (current_x, current_y), (current_x + 3, current_y), (0, 0, 0, 1))
        current_x += 3

    return im


def draw_horizontal_line_diagram(image, min_idx, max_idx, coordinates, should_copy=False):
    """
    :param image:           the image data to work with
    :param min_idx:         the index where to start drawing the heatmap
    :param max_idx:         the index where to stop drawing the heatmap exclusive
    :param coordinates:     an array of coordinates (x,y)
    :param should_copy:     Indicates if the image should be copied b4
    :return:                the modified image data
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    min_idx = max(0, min_idx)

    if max_idx < min_idx:
        max_idx = min_idx + 1
    max_idx = min(len(coordinates), max_idx)

    # a number to start, 3 otherwise would overlap with the start
    current_y = 3
    current_x = coordinates[min_idx][0]

    for i in range(min_idx, max_idx):
        x = coordinates[i][0]
        im = drw.draw_line(im, (current_x, current_y), (x, current_y), (0, 0, 0, 1))
        current_x = x
        im = drw.draw_line(im, (current_x, current_y), (current_x, current_y + 3), (0, 0, 0, 1))
        current_y += 3

    return im


def draw_vertical_needleman_wunsch_line_diagram(image, rounding, coordinate_buffer_a, coordinate_buffer_b,
                                                should_copy=False):
    """

    :param image:                   image data to draw on
    :param rounding:                rounding value
    :param coordinate_buffer_a:     coordinates of the first buffer [(x,y)]
    :param coordinate_buffer_b:     coordinates of the second buffer [(x,y)]
    :param should_copy:             Indicates if the image should be copied b4
    :return:                        the updated image, the buffer with needleman wunsch data (dictionary with "kind", "data")
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    buffer_nw_a = []
    buffer_nw_b = []

    rounding_half = rounding / 2

    for i in range(0, len(coordinate_buffer_a)):
        buffer_nw_a.append(nw.round_with_offset(rounding_half, rounding, coordinate_buffer_a[i][1]))

    for i in range(0, len(coordinate_buffer_b)):
        buffer_nw_b.append(nw.round_with_offset(rounding_half, rounding, coordinate_buffer_b[i][1]))

    solution = nw.needleman_wunsch(buffer_nw_a, buffer_nw_b)

    color = (0, 0, 0, 1)

    current_x = 3
    current_y = solution[0]["data"]

    for i in range(0, len(solution)):
        if solution[i]["kind"] == "delete" or solution[i]["kind"] == "missmatch":
            continue
        y = solution[i]["data"]
        im = drw.draw_line(im, (current_x, current_y), (current_x, y), color)
        current_y = y
        im = drw.draw_line(im, (current_x, current_y), (current_x + 3, current_y), color)
        current_x += 3

    return im, solution


def draw_vertical_needleman_wunsch_semantic_line_diagram(image, coordinate_buffer_a, coordinate_buffer_b,
                                                         semantic_classifier, should_copy=False):
    """
    :param image:                   image data to draw on
    :param coordinate_buffer_a:     coordinates of the first buffer [(x,y)]
    :param coordinate_buffer_b:     coordinates of the second buffer [(x,y)]
    :param should_copy:             Indicates if the image should be copied b4
    :param semantic_classifier      The semantic classifiers class for rounding
    :return:                        the updated image, the buffer with needleman wunsch data (dictionary with "kind", "data")
    """
    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    semantic_coord_a = semantic_classifier.align_buffer_to_classifier(coordinate_buffer_a)
    semantic_coord_b = semantic_classifier.align_buffer_to_classifier(coordinate_buffer_b)

    return draw_vertical_needleman_wunsch_line_diagram(im, 1, semantic_coord_a, semantic_coord_b)


def draw_horizontal_needleman_wunsch_line_diagram(image, rounding, coordinate_buffer_a, coordinate_buffer_b,
                                                  should_copy=False):
    """

    :param image:                   image data to draw on
    :param rounding:                rounding value
    :param coordinate_buffer_a:     coordinates of the first buffer [(x,y)]
    :param coordinate_buffer_b:     coordinates of the second buffer [(x,y)]
    :param should_copy:             Indicates if the image should be copied b4
    :return:                        the updated image, the buffer with needleman wunsch data (dictionary with "kind", "data")
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    buffer_nw_a = []
    buffer_nw_b = []

    rounding_half = rounding / 2

    for i in range(0, len(coordinate_buffer_a)):
        buffer_nw_a.append(nw.round_with_offset(rounding_half, rounding, coordinate_buffer_a[i][0]))

    for i in range(0, len(coordinate_buffer_b)):
        buffer_nw_b.append(nw.round_with_offset(rounding_half, rounding, coordinate_buffer_b[i][0]))

    solution = nw.needleman_wunsch(buffer_nw_a, buffer_nw_b)

    color = (0, 0, 0, 1)

    current_x = solution[0]["data"]
    current_y = 3

    for i in range(0, len(solution)):
        if solution[i]["kind"] == "delete" or solution[i]["kind"] == "missmatch":
            continue
        x = solution[i]["data"]
        im = drw.draw_line(im, (current_x, current_y), (x, current_y), color)
        current_x = x
        im = drw.draw_line(im, (current_x, current_y), (current_x, current_y + 3), color)
        current_y += 3

    return im, solution


def draw_vertical_combined_needleman_wunsch_line_diagram(image, rounding, buffers, should_copy=False):
    """

    :param image:                   image data to draw on
    :param rounding:                rounding value
    :param buffers:                 a buffer of coordinate lists
    :param should_copy:             Indicates if the image should be copied b4
    :return:                        the updated image data and the solution of the needleman wunsch
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    buffers_needle = []

    rounding_half = rounding / 2

    for i in range(0, len(buffers)):
        tmp_buffer = []
        for j in range(0, len(buffers[i])):
            tmp_buffer.append(nw.round_with_offset(rounding_half, rounding, buffers[i][j][1]))
        buffers_needle.append(tmp_buffer)

    current_solution = buffers_needle[0]
    for i in range(1, len(buffers_needle)):
        sol_buffer = nw.needleman_wunsch(buffers_needle[i], current_solution)
        current_solution = nw.to_usable_buffer(sol_buffer)

    color = (0, 0, 0, 1)

    current_x = 3
    current_y = current_solution[0]

    for i in range(0, len(current_solution)):
        y = current_solution[i]
        im = drw.draw_line(im, (current_x, current_y), (current_x, y), color)
        current_y = y
        im = drw.draw_line(im, (current_x, current_y), (current_x + 3, current_y), color)
        current_x += 3

    return im, current_solution


def draw_vertical_combined_needleman_wunsch_semantic_line_diagram(image, buffers, semantic_classifier,
                                                                  should_copy=False):
    """
    :param image:                   image data to draw on
    :param buffers:                 a buffer of coordinate lists
    :param should_copy:             Indicates if the image should be copied b4
    :param semantic_classifier      The semantic classifiers class for rounding
    :return:                        the updated image, the buffer with needleman wunsch data (dictionary with "kind", "data")
    """
    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    semantic_buffers = []
    for buffer in buffers:
        semantic_buffers.append(semantic_classifier.align_buffer_to_classifier(buffer))

    return draw_vertical_combined_needleman_wunsch_line_diagram(im, 1, semantic_buffers)


def draw_horizontal_combined_needleman_wunsch_line_diagram(image, rounding, buffers, should_copy=False):
    """
    :param image:                   image data to draw on
    :param rounding:                rounding value
    :param buffers:                 a buffer of coordinate lists
    :param should_copy:             Indicates if the image should be copied b4
    :return:                        the updated image data and the solution of the needleman wunsch
    """

    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    buffers_needle = []

    rounding_half = rounding / 2

    for i in range(0, len(buffers)):
        tmp_buffer = []
        for j in range(0, len(buffers[i])):
            tmp_buffer.append(nw.round_with_offset(rounding_half, rounding, buffers[i][j][0]))
        buffers_needle.append(tmp_buffer)

    current_solution = buffers_needle[0]
    for i in range(1, len(buffers_needle)):
        sol_buffer = nw.needleman_wunsch(buffers_needle[i], current_solution)
        current_solution = nw.to_usable_buffer(sol_buffer)

    color = (0, 0, 0, 1)

    current_x = current_solution[0]
    current_y = 3

    for i in range(0, len(current_solution)):
        x = current_solution[i]
        im = drw.draw_line(im, (current_x, current_y), (x, current_y), color)
        current_x = x
        im = drw.draw_line(im, (current_x, current_y), (current_x, current_y + 3), color)
        current_y += 3

    return im, current_solution


def draw_semantic_classifier(image, semantic_classifier, should_copy=False):
    """
    :param image:                   image data to draw on
    :param semantic_classifier:     the semantic classifer object to draw
    :param should_copy:             Indicates if the image should be copied b4
    :return:                        the updated image data and the solution of the needleman wunsch

    """
    im = None
    if should_copy:
        im = image.copy()
    else:
        im = image

    semantic_fields = semantic_classifier.get_semantic_fields()

    for field in semantic_fields:
        if field[1] < im.shape[0]:
            im = drw.draw_line(im, (0, field[1]), (image.shape[1] - 1, field[1]), (0, 0, 0, 1))
        x = image.shape[1] - 12
        y = field[0] + 3

        drw.draw_letter(im, (x, y), field[2][0])

    return im
