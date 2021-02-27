var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("Coordinate", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.Coordinate = void 0;
    var Coordinate = (function () {
        function Coordinate(x, y) {
            this.x = x;
            this.y = y;
        }
        Coordinate.prototype.get_x = function () {
            return this.x;
        };
        Coordinate.prototype.get_y = function () {
            return this.y;
        };
        return Coordinate;
    }());
    exports.Coordinate = Coordinate;
});
define("Helpers", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.Helpers = void 0;
    var Helpers = (function () {
        function Helpers() {
        }
        Helpers.array_of_size = function (size) {
            var temp = [];
            for (var i = 0; i < size; i++) {
                temp.push(0);
            }
            return temp;
        };
        return Helpers;
    }());
    exports.Helpers = Helpers;
});
define("Rectangle", ["require", "exports", "Coordinate"], function (require, exports, Coordinate_1) {
    "use strict";
    exports.__esModule = true;
    exports.Rectangle = void 0;
    var Rectangle = (function () {
        function Rectangle(x_start, y_start, x_range, y_range) {
            this.start = new Coordinate_1.Coordinate(x_start, y_start);
            this.x_range = x_range;
            this.y_range = y_range;
        }
        Rectangle.prototype.get_start = function () {
            return this.start;
        };
        Rectangle.prototype.get_x_range = function () {
            return this.x_range;
        };
        Rectangle.prototype.get_y_range = function () {
            return this.y_range;
        };
        return Rectangle;
    }());
    exports.Rectangle = Rectangle;
});
define("ImageCalculator", ["require", "exports", "Coordinate", "Rectangle", "Helpers"], function (require, exports, Coordinate_2, Rectangle_1, Helpers_1) {
    "use strict";
    exports.__esModule = true;
    exports.ImageCalculator = void 0;
    var DISTANCE_CASE;
    (function (DISTANCE_CASE) {
        DISTANCE_CASE[DISTANCE_CASE["IN_MIN"] = 1] = "IN_MIN";
        DISTANCE_CASE[DISTANCE_CASE["INTERPOLATION"] = 2] = "INTERPOLATION";
    })(DISTANCE_CASE || (DISTANCE_CASE = {}));
    var ImageCalculator = (function () {
        function ImageCalculator() {
            this.bytesPerPixel = 4;
            this.color_buffer = [];
            this.blurry_buffer = [];
            this.visible_buffer = [];
            this.has_calculated_lock = false;
            this.max_width = 0;
            this.max_height = 0;
            this.use_rectangle = false;
            this.minimal_width_visibility = 5;
            this.minimal_height_visibility = 5;
            this.use_circle = false;
            this.circle_radius = 3;
            this.use_ellipse = true;
            this.ellipse_x_radius = 150;
            this.ellipse_y_radius = 20;
            this.gradient_radius = 50;
            this.current_render_area = new Rectangle_1.Rectangle(0, 0, 0, 0);
            this.click_log = [];
            this.click_log_times = [];
            this.time_start = 0;
        }
        ImageCalculator.prototype.to_index = function (width_idx, height_idx) {
            return height_idx * this.max_width + width_idx;
        };
        ImageCalculator.prototype.get_render_region = function (current_coordinate, min_radius, max_value) {
            var min = Math.max(0, (current_coordinate - min_radius - this.gradient_radius));
            var max = Math.min(max_value, (current_coordinate + min_radius + this.gradient_radius));
            return [min, max];
        };
        ImageCalculator.prototype.get_color_interpolation = function (idx, alpha) {
            var r = alpha * this.color_buffer[idx * this.bytesPerPixel] + (1.0 - alpha) * this.blurry_buffer[idx * this.bytesPerPixel];
            var g = alpha * this.color_buffer[idx * this.bytesPerPixel + 1] + (1.0 - alpha) * this.blurry_buffer[idx * this.bytesPerPixel + 1];
            var b = alpha * this.color_buffer[idx * this.bytesPerPixel + 2] + (1.0 - alpha) * this.blurry_buffer[idx * this.bytesPerPixel + 2];
            return [r, g, b];
        };
        ImageCalculator.prototype.set_color_buffer = function (buffer, width, height) {
            this.max_width = width;
            this.max_height = height;
            this.current_render_area = new Rectangle_1.Rectangle(0, 0, width, height);
            this.color_buffer = buffer;
        };
        ImageCalculator.prototype.calculate_blurred = function (x_radius_blur, y_radius_blur) {
            this.current_render_area = new Rectangle_1.Rectangle(0, 0, 0, 0);
            var horizontal_buffer = Helpers_1.Helpers.array_of_size(this.color_buffer.length);
            for (var height_iter = 0; height_iter < this.max_height; height_iter++) {
                var height_idx = height_iter * this.max_width * this.bytesPerPixel;
                horizontal_buffer[height_idx] = this.color_buffer[height_idx];
                horizontal_buffer[height_idx + 1] = this.color_buffer[height_idx + 1];
                horizontal_buffer[height_idx + 2] = this.color_buffer[height_idx + 2];
                for (var width_iter = 1; width_iter < this.max_width; width_iter++) {
                    var width_idx = width_iter * this.bytesPerPixel;
                    var width_idx_m = (width_iter - 1) * this.bytesPerPixel;
                    horizontal_buffer[height_idx + width_idx] = horizontal_buffer[height_idx + width_idx_m] + this.color_buffer[height_idx + width_idx];
                    horizontal_buffer[height_idx + width_idx + 1] = horizontal_buffer[height_idx + width_idx_m + 1] + this.color_buffer[height_idx + width_idx + 1];
                    horizontal_buffer[height_idx + width_idx + 2] = horizontal_buffer[height_idx + width_idx_m + 2] + this.color_buffer[height_idx + width_idx + 2];
                }
            }
            var sum_buf = Helpers_1.Helpers.array_of_size(this.color_buffer.length);
            for (var width_iter = 0; width_iter < this.max_width; width_iter++) {
                sum_buf[width_iter * this.bytesPerPixel] = horizontal_buffer[width_iter * this.bytesPerPixel];
                sum_buf[width_iter * this.bytesPerPixel + 1] = horizontal_buffer[width_iter * this.bytesPerPixel + 1];
                sum_buf[width_iter * this.bytesPerPixel + 2] = horizontal_buffer[width_iter * this.bytesPerPixel + 2];
            }
            for (var height_iter = 1; height_iter < this.max_height; height_iter++) {
                var height_idx = height_iter * this.max_width * this.bytesPerPixel;
                var height_idx_m = (height_iter - 1) * this.max_width * this.bytesPerPixel;
                sum_buf[height_idx] = horizontal_buffer[height_idx] + sum_buf[height_idx_m];
                sum_buf[height_idx + 1] = horizontal_buffer[height_idx + 1] + sum_buf[height_idx_m + 1];
                sum_buf[height_idx + 2] = horizontal_buffer[height_idx + 2] + sum_buf[height_idx_m + 2];
                for (var width_iter = 1; width_iter < this.max_width; width_iter++) {
                    var width_idx = width_iter * this.bytesPerPixel;
                    sum_buf[height_idx + width_idx] = sum_buf[height_idx_m + width_idx] + horizontal_buffer[height_idx + width_idx];
                    sum_buf[height_idx + width_idx + 1] = sum_buf[height_idx_m + width_idx + 1] + horizontal_buffer[height_idx + width_idx + 1];
                    sum_buf[height_idx + width_idx + 2] = sum_buf[height_idx_m + width_idx + 2] + horizontal_buffer[height_idx + width_idx + 2];
                }
            }
            var blur_buf = Helpers_1.Helpers.array_of_size(this.color_buffer.length);
            for (var height_iter = 0; height_iter < this.max_height; height_iter++) {
                var current_height = height_iter * this.max_width * this.bytesPerPixel;
                var height_minus_y_idx = Math.max(0, height_iter - y_radius_blur);
                var height_plus_y_idx = Math.min((this.max_height - 1), (height_iter + y_radius_blur));
                var height_minus_y = height_minus_y_idx * this.max_width * this.bytesPerPixel;
                var height_plus_y = height_plus_y_idx * this.max_width * this.bytesPerPixel;
                for (var width_iter = 0; width_iter < this.max_width; width_iter++) {
                    var current_width = width_iter * this.bytesPerPixel;
                    var width_minus_x_idx = Math.max(0, (width_iter - x_radius_blur));
                    var width_plus_x_idx = Math.min((this.max_width - 1), (width_iter + x_radius_blur));
                    var width_minus_x = width_minus_x_idx * this.bytesPerPixel;
                    var width_plus_x = width_plus_x_idx * this.bytesPerPixel;
                    var p_x_p_y = (width_plus_x + height_plus_y);
                    var n_x_n_y = (width_minus_x + height_minus_y);
                    var n_x_p_y = (width_minus_x + height_plus_y);
                    var p_x_n_y = (width_plus_x + height_minus_y);
                    var norm = 1. / ((width_plus_x_idx - width_minus_x_idx) * (height_plus_y_idx - height_minus_y_idx));
                    blur_buf[current_height + current_width] = norm * (sum_buf[p_x_p_y] + sum_buf[n_x_n_y] - sum_buf[n_x_p_y] - sum_buf[p_x_n_y]);
                    blur_buf[current_height + current_width + 1] = norm * (sum_buf[p_x_p_y + 1] + sum_buf[n_x_n_y + 1] - sum_buf[n_x_p_y + 1] - sum_buf[p_x_n_y + 1]);
                    blur_buf[current_height + current_width + 2] = norm * (sum_buf[p_x_p_y + 2] + sum_buf[n_x_n_y + 2] - sum_buf[n_x_p_y + 2] - sum_buf[p_x_n_y + 2]);
                }
            }
            this.blurry_buffer = blur_buf;
            this.has_calculated_lock = true;
            this.time_start = Math.floor(performance.now());
        };
        ImageCalculator.prototype.calculate_visible_area = function (x_coordinate, y_coordinate) {
            var _a, _b, _c, _d, _e, _f;
            x_coordinate = Math.floor(x_coordinate);
            y_coordinate = Math.floor(y_coordinate);
            var gradiant_buffer = __spreadArrays(this.blurry_buffer);
            var y_distance_flag;
            var x_distance_flag;
            var x_min, x_max;
            var y_min, y_max;
            if (this.use_rectangle) {
                _a = this.get_render_region(x_coordinate, this.minimal_width_visibility, this.max_width), x_min = _a[0], x_max = _a[1];
                _b = this.get_render_region(y_coordinate, this.minimal_height_visibility, this.max_height), y_min = _b[0], y_max = _b[1];
            }
            else if (this.use_circle) {
                _c = this.get_render_region(x_coordinate, this.circle_radius, this.max_width), x_min = _c[0], x_max = _c[1];
                _d = this.get_render_region(y_coordinate, this.circle_radius, this.max_height), y_min = _d[0], y_max = _d[1];
            }
            else if (this.use_ellipse) {
                _e = this.get_render_region(x_coordinate, this.ellipse_x_radius, this.max_width), x_min = _e[0], x_max = _e[1];
                _f = this.get_render_region(y_coordinate, this.ellipse_y_radius, this.max_height), y_min = _f[0], y_max = _f[1];
            }
            this.current_render_area = new Rectangle_1.Rectangle(x_min, y_min, x_max - x_min, y_max - y_min);
            this.click_log.push(new Coordinate_2.Coordinate(x_coordinate, y_coordinate));
            this.click_log_times.push(Math.floor(performance.now() - this.time_start));
            if (this.use_rectangle) {
                for (var height_iter = y_min; height_iter < y_max; height_iter++) {
                    y_distance_flag = DISTANCE_CASE.INTERPOLATION;
                    var y_distance = Math.sqrt(Math.pow(y_coordinate - height_iter, 2));
                    if (this.use_rectangle && y_distance < this.minimal_height_visibility) {
                        y_distance_flag = DISTANCE_CASE.IN_MIN;
                    }
                    for (var width_iter = x_min; width_iter < x_max; width_iter++) {
                        x_distance_flag = DISTANCE_CASE.INTERPOLATION;
                        var x_distance = Math.sqrt(Math.pow(x_coordinate - width_iter, 2));
                        if (x_distance < this.minimal_width_visibility) {
                            x_distance_flag = DISTANCE_CASE.IN_MIN;
                        }
                        var idx = this.to_index(width_iter, height_iter);
                        if (x_distance_flag == DISTANCE_CASE.IN_MIN && y_distance_flag == DISTANCE_CASE.IN_MIN) {
                            gradiant_buffer[idx * this.bytesPerPixel] = this.color_buffer[idx * this.bytesPerPixel];
                            gradiant_buffer[idx * this.bytesPerPixel + 1] = this.color_buffer[idx * this.bytesPerPixel + 1];
                            gradiant_buffer[idx * this.bytesPerPixel + 2] = this.color_buffer[idx * this.bytesPerPixel + 2];
                        }
                        else {
                            var x_distance_normalized = Math.max(0, x_distance - this.minimal_width_visibility);
                            x_distance_normalized = Math.max(0, x_distance_normalized / this.gradient_radius);
                            var y_distance_normalized = Math.max(0, y_distance - this.minimal_height_visibility);
                            y_distance_normalized = Math.max(0, y_distance_normalized / this.gradient_radius);
                            var distance = Math.min(1, x_distance_normalized + y_distance_normalized);
                            var alpha = 1.0 - distance;
                            var _g = this.get_color_interpolation(idx, alpha), r = _g[0], g = _g[1], b = _g[2];
                            gradiant_buffer[idx * this.bytesPerPixel] = r;
                            gradiant_buffer[idx * this.bytesPerPixel + 1] = g;
                            gradiant_buffer[idx * this.bytesPerPixel + 2] = b;
                        }
                    }
                }
            }
            else if (this.use_circle) {
                var rad_square = Math.pow(this.circle_radius, 2);
                var rad_grad_square = Math.pow(this.circle_radius + this.gradient_radius, 2);
                for (var height_iter = y_min; height_iter < y_max; height_iter++) {
                    for (var width_iter = x_min; width_iter < x_max; width_iter++) {
                        var clear = Math.pow(width_iter - x_coordinate, 2) + Math.pow(height_iter - y_coordinate, 2) <= rad_square;
                        var inter_value = Math.pow(width_iter - x_coordinate, 2) + Math.pow(height_iter - y_coordinate, 2);
                        var interpolate = inter_value <= rad_grad_square;
                        var idx = this.to_index(width_iter, height_iter);
                        if (clear) {
                            gradiant_buffer[idx * this.bytesPerPixel] = this.color_buffer[idx * this.bytesPerPixel];
                            gradiant_buffer[idx * this.bytesPerPixel + 1] = this.color_buffer[idx * this.bytesPerPixel + 1];
                            gradiant_buffer[idx * this.bytesPerPixel + 2] = this.color_buffer[idx * this.bytesPerPixel + 2];
                        }
                        else if (interpolate) {
                            var x_distance = Math.abs(x_coordinate - width_iter);
                            var y_distance = Math.abs(y_coordinate - height_iter);
                            var x_distance_normalized = Math.max(0, x_distance - this.circle_radius);
                            x_distance_normalized = Math.max(0, x_distance_normalized / this.gradient_radius);
                            var y_distance_normalized = Math.max(0, y_distance - this.circle_radius);
                            y_distance_normalized = Math.max(0, y_distance_normalized / this.gradient_radius);
                            var distance = Math.min(1, Math.sqrt(Math.pow(x_distance_normalized, 2) + Math.pow(y_distance_normalized, 2)));
                            var alpha = 1 - Math.min(distance / this.gradient_radius, 1);
                            var _h = this.get_color_interpolation(idx, alpha), r = _h[0], g = _h[1], b = _h[2];
                            gradiant_buffer[idx * this.bytesPerPixel] = r;
                            gradiant_buffer[idx * this.bytesPerPixel + 1] = g;
                            gradiant_buffer[idx * this.bytesPerPixel + 2] = b;
                        }
                    }
                }
            }
            else if (this.use_ellipse) {
                var x_rad_square = Math.pow(this.ellipse_x_radius, 2);
                var y_rad_square = Math.pow(this.ellipse_y_radius, 2);
                var x_rad_grad_square = Math.pow(this.ellipse_x_radius + this.gradient_radius, 2);
                var y_rad_grad_square = Math.pow(this.ellipse_y_radius + this.gradient_radius, 2);
                for (var height_iter = y_min; height_iter < y_max; height_iter++) {
                    for (var width_iter = x_min; width_iter < x_max; width_iter++) {
                        var clear = Math.pow(width_iter - x_coordinate, 2) / x_rad_square + Math.pow(height_iter - y_coordinate, 2) / y_rad_square <= 1;
                        var inter_value = Math.pow(width_iter - x_coordinate, 2) / x_rad_grad_square + Math.pow(height_iter - y_coordinate, 2) / y_rad_grad_square;
                        var interpolate = inter_value <= 1;
                        var idx = this.to_index(width_iter, height_iter);
                        if (clear) {
                            gradiant_buffer[idx * this.bytesPerPixel] = this.color_buffer[idx * this.bytesPerPixel];
                            gradiant_buffer[idx * this.bytesPerPixel + 1] = this.color_buffer[idx * this.bytesPerPixel + 1];
                            gradiant_buffer[idx * this.bytesPerPixel + 2] = this.color_buffer[idx * this.bytesPerPixel + 2];
                        }
                        else if (interpolate) {
                            var x_distance = Math.abs(x_coordinate - width_iter);
                            var y_distance = Math.abs(y_coordinate - height_iter);
                            var x_distance_normalized = Math.max(0, x_distance - this.ellipse_x_radius);
                            x_distance_normalized = Math.max(0, x_distance_normalized / this.gradient_radius);
                            var y_distance_normalized = Math.max(0, y_distance - this.ellipse_y_radius);
                            y_distance_normalized = Math.max(0, y_distance_normalized / this.gradient_radius);
                            var distance = Math.min(1, Math.sqrt(Math.pow(x_distance_normalized, 2) + Math.pow(y_distance_normalized, 2)));
                            var alpha = 1.0 - distance;
                            var _j = this.get_color_interpolation(idx, alpha), r = _j[0], g = _j[1], b = _j[2];
                            gradiant_buffer[idx * this.bytesPerPixel] = r;
                            gradiant_buffer[idx * this.bytesPerPixel + 1] = g;
                            gradiant_buffer[idx * this.bytesPerPixel + 2] = b;
                        }
                    }
                }
            }
            this.visible_buffer = gradiant_buffer;
        };
        ImageCalculator.prototype.clear_click_log = function () {
            this.click_log = [];
        };
        ImageCalculator.prototype.get_click_log = function () {
            return this.click_log;
        };
        ImageCalculator.prototype.get_click_log_times = function () {
            return this.click_log_times;
        };
        ImageCalculator.prototype.set_click_log = function (click_log) {
            this.click_log = click_log;
        };
        ImageCalculator.prototype.set_click_log_from_string = function (data_str) {
            var coordinates_pair_tuples_String = data_str.split(" ");
            var click_log_vector = [];
            for (var i = 0; i < coordinates_pair_tuples_String.length; i++) {
                var coord_string = coordinates_pair_tuples_String[i].split("-");
                var coord = new Coordinate_2.Coordinate(Number(coord_string[0]), Number(coord_string[1]));
                click_log_vector.push(coord);
            }
            this.set_click_log(click_log_vector);
        };
        ImageCalculator.prototype.get_click_log_size = function () {
            return this.click_log.length;
        };
        ImageCalculator.prototype.get_current_render_area = function () {
            return this.current_render_area;
        };
        ImageCalculator.prototype.get_visible_buffer = function () {
            return this.visible_buffer;
        };
        ImageCalculator.prototype.get_blurry_buffer = function () {
            return this.blurry_buffer;
        };
        ImageCalculator.prototype.get_color_buffer = function () {
            return this.color_buffer;
        };
        ImageCalculator.prototype.read_and_reset_calculated_lock = function () {
            var tmp = this.has_calculated_lock;
            this.has_calculated_lock = false;
            return tmp;
        };
        ImageCalculator.prototype.set_use_rectangle = function () {
            this.use_rectangle = true;
            this.use_circle = false;
            this.use_ellipse = false;
        };
        ImageCalculator.prototype.set_minimal_width_radius = function (minimal_width_radius) {
            this.minimal_width_visibility = minimal_width_radius;
        };
        ImageCalculator.prototype.get_minimal_width_radius = function () {
            return this.minimal_width_visibility;
        };
        ImageCalculator.prototype.set_minimal_height_radius = function (minimal_height_radius) {
            this.minimal_height_visibility = minimal_height_radius;
        };
        ImageCalculator.prototype.get_minimal_height_radius = function () {
            return this.minimal_height_visibility;
        };
        ImageCalculator.prototype.set_gradient_radius = function (gradient_radius) {
            this.gradient_radius = gradient_radius;
        };
        ImageCalculator.prototype.get_gradient_radius = function () {
            return this.gradient_radius;
        };
        ImageCalculator.prototype.set_use_circle = function () {
            this.use_rectangle = false;
            this.use_circle = true;
            this.use_ellipse = false;
        };
        ImageCalculator.prototype.set_circle_radius = function (radius) {
            this.circle_radius = radius;
        };
        ImageCalculator.prototype.get_circle_radius = function () {
            return this.circle_radius;
        };
        ImageCalculator.prototype.set_use_ellipse = function () {
            this.use_rectangle = false;
            this.use_circle = false;
            this.use_ellipse = true;
        };
        ImageCalculator.prototype.set_ellipse_radius_x = function (radius_x) {
            this.ellipse_x_radius = radius_x;
        };
        ImageCalculator.prototype.set_ellipse_radius_y = function (radius_y) {
            this.ellipse_y_radius = radius_y;
        };
        ImageCalculator.prototype.get_ellipse_radius_x = function () {
            return this.ellipse_x_radius;
        };
        ImageCalculator.prototype.get_ellipse_radius_y = function () {
            return this.ellipse_y_radius;
        };
        return ImageCalculator;
    }());
    exports.ImageCalculator = ImageCalculator;
});
define("useCases", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.UseCases = void 0;
    var UseCases = (function () {
        function UseCases() {
        }
        UseCases.isValid = function () {
            var value = 0;
            if (UseCases.htmlTesting === true)
                value++;
            if (UseCases.soSciSurvey === true)
                value++;
            return value === 1;
        };
        UseCases.htmlTesting = true;
        UseCases.soSciSurvey = false;
        return UseCases;
    }());
    exports.UseCases = UseCases;
});
define("rEYEker", ["require", "exports", "useCases", "ImageCalculator"], function (require, exports, useCases_1, ImageCalculator_1) {
    "use strict";
    exports.__esModule = true;
    var mouseXOverMainCanvas;
    var mouseYOverMainCanvas;
    var shouldRenderNew = true;
    var mouseMoved = true;
    var mouseClickedLeft = false;
    var mouseClickMode = true;
    var calculateNew = true;
    var ex_1_url = "./images/InsertSort.PNG";
    var ex_2_url = "./images/Calculation.PNG";
    var ex_3_url = "./images/Rectangle.PNG";
    var imageUrl;
    var variableNameClickLog;
    var variableNameTimeLog = null;
    var x_blur_radius = 8;
    var y_blur_radius = 8;
    var grad_radius = 30;
    var minimal_width = 200;
    var minimal_height = 1;
    var circle_radius = 50;
    var ellipse_radius_x = 100;
    var ellipse_radius_y = 50;
    var use_rectangle = true;
    var use_circle = false;
    var use_ellipse = false;
    var visibleImageCanvas;
    var clickLogCanvas;
    var xFoldingRangeInput;
    var yFoldingRangeInput;
    var useRectangleInput;
    var minimalXVisibilityInput;
    var minimalYVisibilityInput;
    var useCircleInput;
    var circleRadiusInput;
    var useEllipseInput;
    var ellipseXRadiusInput;
    var ellipseYRadiusInput;
    var blurRadiusInput;
    var mouseClickActivationInput;
    var ex_1_box;
    var ex_2_box;
    var ex_3_box;
    if (useCases_1.UseCases.htmlTesting === true) {
        xFoldingRangeInput = document.getElementById("xFoldingRange");
        yFoldingRangeInput = document.getElementById("yFoldingRange");
        minimalXVisibilityInput = document.getElementById("minimalXVisibility");
        minimalYVisibilityInput = document.getElementById("minimalYVisibility");
        blurRadiusInput = document.getElementById("blurRadius");
        mouseClickActivationInput = document.getElementById("mouseClickActivation");
        ex_1_box = document.getElementById("ex_1");
        ex_2_box = document.getElementById("ex_2");
        ex_3_box = document.getElementById("ex_3");
        visibleImageCanvas = document.getElementById("visible-image-canvas");
        clickLogCanvas = document.getElementById("click-log-canvas");
        useRectangleInput = document.getElementById("useRectangleCheckbox");
        useCircleInput = document.getElementById("useCircleCheckbox");
        useEllipseInput = document.getElementById("useEllipseCheckbox");
        circleRadiusInput = document.getElementById("circleRadius");
        ellipseXRadiusInput = document.getElementById("ellipseXRadius");
        ellipseYRadiusInput = document.getElementById("ellipseYRadius");
    }
    if (useCases_1.UseCases.soSciSurvey === true) {
        imageUrl = document.getElementById("imageToBlurTag").innerHTML;
        variableNameClickLog = document.getElementById("clickLogVariable").innerHTML;
        if (document.getElementById("timeLogVariable") != null) {
            variableNameTimeLog = document.getElementById("timeLogVariable").innerHTML;
        }
        visibleImageCanvas = document.getElementById("visible-image-canvas");
    }
    var canvas = document.getElementById("bubble-image-canvas");
    var ctx = canvas.getContext("2d");
    var image = new Image();
    var eyeTrackImage;
    visibleImageCanvas.addEventListener('mousemove', function (event) {
        var rect = visibleImageCanvas.getBoundingClientRect();
        mouseXOverMainCanvas = event.x - rect.left;
        mouseYOverMainCanvas = event.y - rect.top;
        mouseMoved = true;
    });
    visibleImageCanvas.addEventListener('mousedown', function (event) {
        if (event.button === 0) {
            var rect = visibleImageCanvas.getBoundingClientRect();
            mouseXOverMainCanvas = event.x - rect.left;
            mouseYOverMainCanvas = event.y - rect.top;
            mouseClickedLeft = true;
        }
    });
    if (useCases_1.UseCases.htmlTesting === true) {
        xFoldingRangeInput.oninput = function () {
            var xBlur = Number(xFoldingRangeInput.value);
            var yBlur = Number(yFoldingRangeInput.value);
            eyeTrackImage.calculate_blurred(xBlur, yBlur);
            shouldRenderNew = true;
            document.getElementById("xFoldingRangeLabel").innerText = "[" + xBlur + "]";
        };
        yFoldingRangeInput.oninput = function () {
            var xBlur = Number(xFoldingRangeInput.value);
            var yBlur = Number(yFoldingRangeInput.value);
            eyeTrackImage.calculate_blurred(xBlur, yBlur);
            shouldRenderNew = true;
            document.getElementById("yFoldingRangeLabel").innerText = "[" + yBlur + "]";
        };
        minimalXVisibilityInput.oninput = function () {
            var minimalXVisibility = Number(minimalXVisibilityInput.value);
            eyeTrackImage.set_minimal_width_radius(minimalXVisibility);
            document.getElementById("minimalXVisibilityLabel").innerText = "[" + minimalXVisibility + "]";
        };
        minimalYVisibilityInput.oninput = function () {
            var minimalYVisibility = Number(minimalYVisibilityInput.value);
            eyeTrackImage.set_minimal_height_radius(minimalYVisibility);
            document.getElementById("minimalYVisibilityLabel").innerText = "[" + minimalYVisibility + "]";
        };
        blurRadiusInput.oninput = function () {
            var blurRadius = Number(blurRadiusInput.value);
            eyeTrackImage.set_gradient_radius(blurRadius);
            document.getElementById("blurRadiusLabel").innerText = "[" + blurRadius + "]";
        };
        mouseClickActivationInput.onchange = function () {
            mouseClickMode = mouseClickActivationInput.checked;
        };
        ex_1_box.onchange = function () {
            if (ex_1_box.checked === true) {
                imageUrl = ex_1_url;
                ex_2_box.checked = false;
                ex_3_box.checked = false;
                calculateNew = true;
                eyeTrackImage.clear_click_log();
            }
        };
        ex_2_box.onchange = function () {
            if (ex_2_box.checked === true) {
                imageUrl = ex_2_url;
                ex_1_box.checked = false;
                ex_3_box.checked = false;
                calculateNew = true;
                eyeTrackImage.clear_click_log();
            }
        };
        ex_3_box.onchange = function () {
            if (ex_3_box.checked === true) {
                imageUrl = ex_3_url;
                ex_1_box.checked = false;
                ex_2_box.checked = false;
                calculateNew = true;
                eyeTrackImage.clear_click_log();
            }
        };
        useRectangleInput.onchange = function () {
            if (useRectangleInput.checked == true) {
                use_rectangle = true;
                use_circle = false;
                useCircleInput.checked = false;
                use_ellipse = false;
                useEllipseInput.checked = false;
                eyeTrackImage.set_use_rectangle();
            }
        };
        useCircleInput.onchange = function () {
            if (useCircleInput.checked == true) {
                use_rectangle = true;
                useRectangleInput.checked = false;
                use_circle = false;
                use_ellipse = false;
                useEllipseInput.checked = false;
                eyeTrackImage.set_use_circle();
            }
        };
        useEllipseInput.onchange = function () {
            if (useEllipseInput.checked == true) {
                use_rectangle = true;
                useRectangleInput.checked = false;
                use_circle = false;
                useCircleInput.checked = false;
                use_ellipse = false;
                eyeTrackImage.set_use_ellipse();
            }
        };
        circleRadiusInput.oninput = function () {
            var circle_radius = Number(circleRadiusInput.value);
            eyeTrackImage.set_circle_radius(circle_radius);
            document.getElementById("circleRadiusLabel").innerText = "[" + circle_radius + "]";
        };
        ellipseXRadiusInput.oninput = function () {
            var ellipseXRadius = Number(ellipseXRadiusInput.value);
            eyeTrackImage.set_ellipse_radius_x(ellipseXRadius);
            document.getElementById("ellipseXRadiusLabel").innerText = "[" + ellipseXRadius + "]";
        };
        ellipseYRadiusInput.oninput = function () {
            var ellipseYRadius = Number(ellipseYRadiusInput.value);
            eyeTrackImage.set_ellipse_radius_y(ellipseYRadius);
            document.getElementById("ellipseYRadiusLabel").innerText = "[" + ellipseYRadius + "]";
        };
    }
    image.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buffer_canvas, buffer_ctx, colorBuffer, colorBufferData, data, width, height;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canvas.width = image.width;
                        canvas.height = image.height;
                        visibleImageCanvas.width = image.width;
                        visibleImageCanvas.height = image.height;
                        buffer_canvas = document.createElement("canvas");
                        buffer_canvas.width = image.width;
                        buffer_canvas.height = image.height;
                        buffer_ctx = buffer_canvas.getContext("2d");
                        return [4, buffer_ctx.drawImage(image, 0, 0, image.width, image.height)];
                    case 1:
                        _a.sent();
                        colorBuffer = buffer_ctx.getImageData(0, 0, image.width, image.height);
                        colorBufferData = Uint8Array.from(colorBuffer.data);
                        return [4, buffer_canvas.remove()];
                    case 2:
                        _a.sent();
                        data = [].slice.call(colorBufferData);
                        width = image.width;
                        height = image.height;
                        eyeTrackImage.set_color_buffer(data, width, height);
                        return [4, eyeTrackImage.calculate_blurred(x_blur_radius, y_blur_radius)];
                    case 3:
                        _a.sent();
                        if (use_rectangle) {
                            eyeTrackImage.set_use_rectangle();
                        }
                        eyeTrackImage.set_gradient_radius(grad_radius);
                        eyeTrackImage.set_minimal_width_radius(minimal_width);
                        eyeTrackImage.set_minimal_height_radius(minimal_height);
                        if (use_circle) {
                            eyeTrackImage.set_use_circle();
                        }
                        eyeTrackImage.set_circle_radius(circle_radius);
                        if (use_ellipse) {
                            eyeTrackImage.set_use_ellipse();
                        }
                        eyeTrackImage.set_ellipse_radius_x(ellipse_radius_x);
                        eyeTrackImage.set_ellipse_radius_y(ellipse_radius_y);
                        calculateNew = false;
                        return [2];
                }
            });
        });
    };
    function drawSubPart(y_start, y_end, x_start, x_end, arrayBuffer, width, context) {
        return __awaiter(this, void 0, void 0, function () {
            var y, pos_y, x, pos, idx;
            return __generator(this, function (_a) {
                for (y = y_start; y < y_end; y++) {
                    pos_y = y * width;
                    for (x = x_start; x < x_end; x++) {
                        pos = pos_y + x;
                        idx = pos * 4;
                        context.fillStyle = 'rgb(' + Math.floor(arrayBuffer[idx]) + ',' + Math.floor(arrayBuffer[idx + 1]) + ',' + Math.floor(arrayBuffer[idx + 2]) + ')';
                        context.fillRect(x, y, 1, 1);
                    }
                }
                return [2];
            });
        });
    }
    function drawBlurryBuffer() {
        return __awaiter(this, void 0, void 0, function () {
            var buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        while (eyeTrackImage.read_and_reset_calculated_lock() == false) {
                        }
                        buffer = eyeTrackImage.get_blurry_buffer();
                        return [4, drawSubPart(0, image.height, 0, image.width, buffer, image.width, ctx)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    }
    function redrawRenderArea(arrayBuffer, width, canvas) {
        return __awaiter(this, void 0, void 0, function () {
            var ctx_tmp, new_render, y_start, y_end, x_start, x_end;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx_tmp = canvas.getContext("2d");
                        ctx_tmp.clearRect(0, 0, canvas.width, canvas.height);
                        new_render = eyeTrackImage.get_current_render_area();
                        y_start = new_render.get_start().get_y();
                        y_end = new_render.get_start().get_y() + new_render.get_y_range();
                        x_start = new_render.get_start().get_x();
                        x_end = new_render.get_start().get_x() + new_render.get_x_range();
                        return [4, drawSubPart(y_start, y_end, x_start, x_end, arrayBuffer, width, ctx_tmp)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    }
    function drawVisiblePart() {
        return __awaiter(this, void 0, void 0, function () {
            var buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eyeTrackImage.calculate_visible_area(mouseXOverMainCanvas, mouseYOverMainCanvas);
                        buffer = eyeTrackImage.get_visible_buffer();
                        return [4, redrawRenderArea(buffer, image.width, visibleImageCanvas)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    }
    function drawImage() {
        return __awaiter(this, void 0, void 0, function () {
            var log, data, i, time, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(shouldRenderNew === true)) return [3, 2];
                        shouldRenderNew = false;
                        return [4, drawBlurryBuffer()];
                    case 1:
                        _a.sent();
                        return [3, 6];
                    case 2:
                        if (!(mouseClickMode === false && mouseMoved === true)) return [3, 4];
                        mouseMoved = false;
                        return [4, drawVisiblePart()];
                    case 3:
                        _a.sent();
                        return [3, 6];
                    case 4:
                        if (!(mouseClickMode === true && mouseClickedLeft === true)) return [3, 6];
                        mouseClickedLeft = false;
                        return [4, drawVisiblePart()];
                    case 5:
                        _a.sent();
                        log = eyeTrackImage.get_click_log();
                        data = "";
                        for (i = 0; i < log.length; i++) {
                            data += log[i].get_x() + "-" + log[i].get_y() + " ";
                        }
                        console.log("Data: " + data);
                        time = eyeTrackImage.get_click_log_times();
                        data = "";
                        for (i = 0; i < time.length; i++) {
                            data += time[i] + " ";
                        }
                        console.log("Time: " + data);
                        _a.label = 6;
                    case 6: return [2];
                }
            });
        });
    }
    function running() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(calculateNew === true)) return [3, 1];
                        image.src = imageUrl;
                        shouldRenderNew = true;
                        return [3, 3];
                    case 1: return [4, drawImage()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        requestAnimationFrame(running);
                        return [2];
                }
            });
        });
    }
    function setup() {
        return __awaiter(this, void 0, void 0, function () {
            var x_blur_radius_element, y_blur_radius_element, grad_radius_element, minimal_width_element, minimal_height_element, circle_radius_element, ellipse_radius_x_element, ellipse_radius_y_element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (useCases_1.UseCases.isValid() === false) {
                            return [2];
                        }
                        eyeTrackImage = new ImageCalculator_1.ImageCalculator();
                        if (useCases_1.UseCases.htmlTesting === true) {
                            imageUrl = ex_1_url;
                        }
                        if (useCases_1.UseCases.soSciSurvey === true) {
                            document.getElementById("submit0").addEventListener('click', function (event) {
                                var log = eyeTrackImage.get_click_log();
                                var data = "";
                                for (var i = 0; i < log.length; i++) {
                                    data += log[i].get_x() + "-" + log[i].get_y() + " ";
                                }
                                document.getElementById(variableNameClickLog).value = data;
                                if (variableNameTimeLog != null) {
                                    var log_1 = eyeTrackImage.get_click_log_times();
                                    var data_1 = "";
                                    for (var i = 0; i < log_1.length; i++) {
                                        data_1 += log_1[i] + " ";
                                    }
                                    document.getElementById(variableNameTimeLog).value = data_1;
                                }
                            });
                            calculateNew = true;
                        }
                        x_blur_radius_element = document.getElementById("x_blur_radius");
                        if (x_blur_radius_element != null) {
                            x_blur_radius = Number(x_blur_radius_element.innerHTML);
                        }
                        y_blur_radius_element = document.getElementById("y_blur_radius");
                        if (y_blur_radius_element != null) {
                            y_blur_radius = Number(y_blur_radius_element.innerHTML);
                        }
                        grad_radius_element = document.getElementById("grad_radius");
                        if (grad_radius_element != null) {
                            grad_radius = Number(grad_radius_element.innerHTML);
                        }
                        minimal_width_element = document.getElementById("minimal_width");
                        if (minimal_width_element != null) {
                            minimal_width = Number(minimal_width_element.innerHTML);
                        }
                        minimal_height_element = document.getElementById("minimal_height");
                        if (minimal_height_element != null) {
                            minimal_height = Number(minimal_height_element.innerHTML);
                        }
                        circle_radius_element = document.getElementById("circle_radius");
                        if (circle_radius_element != null) {
                            circle_radius = Number(circle_radius_element.innerHTML);
                        }
                        ellipse_radius_x_element = document.getElementById("ellipse_radius_x");
                        if (ellipse_radius_x_element != null) {
                            ellipse_radius_x = Number(ellipse_radius_x_element.innerHTML);
                        }
                        ellipse_radius_y_element = document.getElementById("ellipse_radius_y");
                        if (ellipse_radius_y_element != null) {
                            ellipse_radius_y = Number(ellipse_radius_y_element.innerHTML);
                        }
                        if (document.getElementById("use_rectangle") != null) {
                            use_rectangle = true;
                        }
                        if (document.getElementById("use_circle") != null) {
                            use_circle = true;
                        }
                        if (document.getElementById("use_ellipse") != null) {
                            use_ellipse = true;
                        }
                        return [4, running()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    }
    requestAnimationFrame(setup);
});
