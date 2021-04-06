class ClickSettings:
    def __init__(self):
        self.grad_saver = 0
        self.grad_radius = 30

        self.use_rectangle = True
        self.minimal_width = 200
        self.minimal_height = 1

        self.use_circle = False
        self.radius = 50

        self.use_ellipse = False
        self.x_radius = 100
        self.y_radius = 50

    def add_grad_radius_to_shape(self):
        self.minimal_height += self.grad_radius
        self.minimal_width += self.grad_radius
        self.radius += self.grad_radius
        self.x_radius += self.grad_radius
        self.y_radius += self.grad_radius
        self.grad_saver = self.grad_radius
        self.grad_radius = 0

    def reset_grad_radius_to_shape(self):
        self.grad_radius = self.grad_saver
        self.minimal_height -= self.grad_radius
        self.minimal_width -= self.grad_radius
        self.radius -= self.grad_radius
        self.x_radius -= self.grad_radius
        self.y_radius -= self.grad_radius

    def load_from_dict(self, dic):
        if "grad_radius" in dic:
            self.grad_radius = dic["grad_radius"]
        if "minimal_width" in dic:
            self.minimal_width = dic["minimal_width"]
        if "minimal_height" in dic:
            self.minimal_height = dic["minimal_height"]
        if "radius" in dic:
            self.radius = dic["radius"]
        if "radius_x" in dic:
            self.x_radius = dic["radius_x"]
        if "radius_y" in dic:
            self.y_radius = dic["radius_y"]
        if "use_rectangle" in dic:
            self.use_rectangle = dic["use_rectangle"]
        if "use_circle" in dic:
            self.use_circle = dic["use_circle"]
        if "use_ellipse" in dic:
            self.use_ellipse = dic["use_ellipse"]

    @staticmethod
    def new_rectangle(width, height, radius):
        """
        a function to return a new clickSetting based on a rectangle

        :param width:
        :param height:
        :param radius:
        :return:
        """
        clk = ClickSettings()
        clk.make_use_rectangle(width, height)
        clk.grad_radius = radius
        return clk

    def make_use_rectangle(self, width, height):
        """
        function to make use of rectangle

        :param width:
        :param height:
        :return:
        """
        self.use_rectangle = True
        self.use_ellipse = False
        self.use_circle = False

        self.minimal_width = width
        self.minimal_height = height

    @staticmethod
    def new_rectangle(radius, grad_radius):
        """
        a function to return a new clickSetting based on a circle

        :param grad_radius:
        :param radius:
        :return:
        """
        clk = ClickSettings()
        clk.make_use_circle(radius)
        clk.grad_radius = grad_radius
        return clk

    def make_use_circle(self, radius):
        """
        function to make use of circle

        :param radius:
        :return:
        """
        self.use_rectangle = False
        self.use_ellipse = False
        self.use_circle = True

        self.radius = radius

    @staticmethod
    def new_ellipse(x_radius, y_radius, radius):
        """
        a function to return a new clickSetting based on a ellipse

        :param y_radius:
        :param x_radius:
        :param radius:
        :return:
        """
        clk = ClickSettings()
        clk.make_use_ellipse(x_radius, y_radius)
        clk.grad_radius = radius
        return clk

    def make_use_ellipse(self, x_radius, y_radius):
        """
        function to make use of ellipse

        :param x_radius:
        :param y_radius:
        :return:
        """
        self.use_rectangle = False
        self.use_ellipse = True
        self.use_circle = False

        self.x_radius = x_radius
        self.y_radius = y_radius
