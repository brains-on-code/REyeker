import json


class SemanticClassifier:
    def __init__(self, height):
        self.semantic_fields = ["N"] * height

    def set_semantic_fields(self, top, bot, value):
        """

        :param top:     start of the set semantic
        :param bot:     end of the set semantic
        :param value:   semantic value
        :return:        nothing
        """

        for i in range(top, bot):
            self.semantic_fields[i] = value

    def get_semantic_fields(self):
        """
        :return:    an array of tupüles (start, end, value)
        """

        result = []
        start = 0
        current = self.semantic_fields[0]

        for i in range(0, len(self.semantic_fields)):
            if self.semantic_fields[i] != current:
                result.append((start, i, current))
                start = i
                current = self.semantic_fields[i]

        result.append((start, len(self.semantic_fields), current))
        return result

    def align_buffer_to_classifier(self, buffer):
        """

        :param buffer:  a buffer of coordinate data, align the y value to the semantic classifier
        :return:        the aligned buffer
        """

        tmp_buffer = []
        semantic_fields = self.get_semantic_fields()
        for field in buffer:
            value = field[1]
            new_value = self.align_value_to_classifier(semantic_fields, value)
            tmp_buffer.append((field[0], new_value))

        return tmp_buffer

    @staticmethod
    def align_value_to_classifier(semantic_fields, value):
        """

        :param semantic_fields:     an array of tuples of semantic classifiers
        :param value:               the value wich should be aligned
        :return:                    the aligned value
        """
        for i in range(0, len(semantic_fields)):
            if semantic_fields[i][0] <= value < semantic_fields[i][1]:
                return int((semantic_fields[i][1] + semantic_fields[i][0]) / 2)

        return 0

    @staticmethod
    def get_classifier_of_point(semantic_fields, value):
        """

        :param semantic_fields:     an array of tuples representing the semantic field
        :param value:               the y value of the point
        :return:                    returns the tuple, where the pointlies
        """

        for i in range(0, len(semantic_fields)):
            if semantic_fields[i][0] <= value < semantic_fields[i][1]:
                return semantic_fields[i]

        return None

    def add_current_classifiers_to_dict(self, some_dict):
        """

        :param some_dict:       an object where to add the tuple to
        :return:                the same object modified
        """
        classifiers = self.get_semantic_fields()
        data_to_add = []
        for i in range(0, len(classifiers)):
            tmp = {"top": classifiers[i][0], "bot": classifiers[i][1], "classifier": classifiers[i][2]}
            data_to_add.append(tmp)

        some_dict["semantic_classifier"] = data_to_add

        return some_dict

    def get_semantic_field_workflow(self, coordinates):
        """
        :param coordinates: and array of coordinates, which will be analysed for their structure
        :return:            an array of Strings which show the workflow in respect of the semantic classifier
        """

        semantic_fields = self.get_semantic_fields()
        return [self.get_classifier_of_point(semantic_fields, x[1])[2] for x in coordinates]

    def load_from_tuples(self, tuple_list):
        """

        :param tuple_list:  a list of tuples (top, bot, classifier)
        :return:            nothing
        """

        for data in tuple_list:
            self.set_semantic_fields(data[0], data[1], data[2])

    def save_to_json(self, path):
        """

        :param path:    The path and Filename where the file should be created
        :return:        norhing
        """

        data_dict = {}
        data_dict = self.add_current_classifiers_to_dict(data_dict)

        data_str = json.dumps(data_dict)

        file = open(path, "w")
        file.write(data_str)
        file.close()
