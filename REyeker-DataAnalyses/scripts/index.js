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
        Coordinate.prototype.stringify = function () {
            return this.x + "-" + this.y;
        };
        return Coordinate;
    }());
    exports.Coordinate = Coordinate;
});
define("clickDataSaver", ["require", "exports", "Coordinate"], function (require, exports, Coordinate_1) {
    "use strict";
    exports.__esModule = true;
    exports.clickDataSaver = void 0;
    var clickDataSaver = (function () {
        function clickDataSaver() {
        }
        clickDataSaver.string_to_click_log = function (data_str) {
            var coordinates_pair_tuples_String = data_str.split(" ");
            var click_log_vector = [];
            for (var i = 0; i < coordinates_pair_tuples_String.length; i++) {
                var coord_string = coordinates_pair_tuples_String[i].split("-");
                var coord = new Coordinate_1.Coordinate(Number(coord_string[0]), Number(coord_string[1]));
                click_log_vector.push(coord);
            }
            clickDataSaver.clickLogData.push(click_log_vector);
        };
        clickDataSaver.string_to_time_log = function (data_str) {
            var time_String = data_str.split(" ");
            var time_log_vector = [];
            for (var i = 0; i < time_String.length; i++) {
                var time_stamp = parseInt(time_String[i]);
                time_log_vector.push(time_stamp);
            }
            clickDataSaver.timeLogData.push(time_log_vector);
            if (clickDataSaver.timeLogData[clickDataSaver.timeLogData.length - 1].length != clickDataSaver.clickLogData[clickDataSaver.clickLogData.length - 1].length) {
                clickDataSaver.use_times = false;
            }
        };
        clickDataSaver.get_current_log = function () {
            return clickDataSaver.clickLogData[clickDataSaver.current];
        };
        clickDataSaver.get_current_time_log = function () {
            return clickDataSaver.timeLogData[clickDataSaver.current];
        };
        clickDataSaver.clear_current_log = function () {
            clickDataSaver.clickLogData = [];
            clickDataSaver.timeLogData = [];
            clickDataSaver.current = -1;
            clickDataSaver.grad_radius = 30;
            clickDataSaver.minimal_width = 200;
            clickDataSaver.minimal_height = 1;
            clickDataSaver.imageWithDataOfClickLog = "./images/InsertSort.PNG";
        };
        clickDataSaver.set_current_log = function (dataToSet) {
            if ("imageName" in dataToSet) {
                clickDataSaver.imageWithDataOfClickLog = dataToSet["imageName"];
            }
            if ("data" in dataToSet) {
                var dataString = dataToSet["data"];
                for (var i = 0; i < dataString.length; i++) {
                    var data = dataString[i];
                    clickDataSaver.string_to_click_log(data);
                }
                if (clickDataSaver.clickLogData.length > 0) {
                    clickDataSaver.current = 0;
                }
            }
            if ("use_times" in dataToSet) {
                clickDataSaver.use_times = dataToSet["use_times"];
            }
            if ("times" in dataToSet) {
                var timeString = dataToSet["times"];
                for (var i = 0; i < timeString.length; i++) {
                    var data = timeString[i];
                    clickDataSaver.string_to_time_log(data);
                }
            }
            if ("grad_radius" in dataToSet) {
                clickDataSaver.grad_radius = dataToSet["grad_radius"];
            }
            if ("use_rectangle" in dataToSet && dataToSet["use_rectangle"] === true) {
                clickDataSaver.use_rectangle = true;
                clickDataSaver.use_circle = false;
                clickDataSaver.use_ellipse = false;
                if ("minimal_width" in dataToSet) {
                    clickDataSaver.minimal_width = dataToSet["minimal_width"];
                }
                if ("minimal_height" in dataToSet) {
                    clickDataSaver.minimal_height = dataToSet["minimal_height"];
                }
            }
            else if ("use_circle" in dataToSet && dataToSet["use_circle"] === true) {
                clickDataSaver.use_rectangle = false;
                clickDataSaver.use_circle = true;
                clickDataSaver.use_ellipse = false;
                if ("radius" in dataToSet) {
                    clickDataSaver.radius = dataToSet["radius"];
                }
            }
            else if ("use_ellipse" in dataToSet && dataToSet["use_ellipse"] === true) {
                clickDataSaver.use_rectangle = false;
                clickDataSaver.use_circle = false;
                clickDataSaver.use_ellipse = true;
                if ("radius_x" in dataToSet) {
                    clickDataSaver.radius_x = dataToSet["radius_x"];
                }
                else if ("radius_y" in dataToSet) {
                    clickDataSaver.radius_y = dataToSet["radius_y"];
                }
            }
        };
        clickDataSaver.add_current_to_object = function (object_to_add_on) {
            object_to_add_on["imageName"] = clickDataSaver.imageWithDataOfClickLog;
            object_to_add_on["grad_radius"] = clickDataSaver.grad_radius;
            object_to_add_on["minimal_width"] = clickDataSaver.minimal_width;
            object_to_add_on["minimal_height"] = clickDataSaver.minimal_height;
            object_to_add_on["radius"] = clickDataSaver.radius;
            object_to_add_on["radius_x"] = clickDataSaver.radius_x;
            object_to_add_on["radius_y"] = clickDataSaver.radius_y;
            object_to_add_on["use_rectangle"] = clickDataSaver.use_rectangle;
            object_to_add_on["use_circle"] = clickDataSaver.use_circle;
            object_to_add_on["use_ellipse"] = clickDataSaver.use_ellipse;
            object_to_add_on["use_times"] = clickDataSaver.use_times;
            var clickLogStringArray = [];
            for (var i = 0; i < clickDataSaver.clickLogData.length; i++) {
                var oneDataSet = "";
                for (var j = 0; j < clickDataSaver.clickLogData[i].length; j++) {
                    oneDataSet += clickDataSaver.clickLogData[i][j].stringify();
                    if (j != clickDataSaver.clickLogData[i].length - 1) {
                        oneDataSet += " ";
                    }
                }
                clickLogStringArray.push(oneDataSet);
            }
            object_to_add_on["data"] = clickLogStringArray;
            var timeLogSringArray = [];
            for (var i = 0; i < clickDataSaver.timeLogData.length; i++) {
                var oneDataSet = "";
                for (var j = 0; j < clickDataSaver.timeLogData[i].length; j++) {
                    oneDataSet += clickDataSaver.timeLogData[i][j];
                    if (j != clickDataSaver.clickLogData[i].length - 1) {
                        oneDataSet += " ";
                    }
                }
                timeLogSringArray.push(oneDataSet);
            }
            if (timeLogSringArray.length != 0) {
                object_to_add_on["times"] = timeLogSringArray;
            }
            return object_to_add_on;
        };
        clickDataSaver.imageWithDataOfClickLog = "./images/InsertSort.PNG";
        clickDataSaver.clickLogData = [];
        clickDataSaver.timeLogData = [];
        clickDataSaver.current = -1;
        clickDataSaver.use_times = true;
        clickDataSaver.use_rectangle = true;
        clickDataSaver.use_circle = false;
        clickDataSaver.use_ellipse = false;
        clickDataSaver.grad_radius = 30;
        clickDataSaver.minimal_width = 200;
        clickDataSaver.minimal_height = 1;
        clickDataSaver.radius = 50;
        clickDataSaver.radius_x = 100;
        clickDataSaver.radius_y = 50;
        return clickDataSaver;
    }());
    exports.clickDataSaver = clickDataSaver;
});
define("BoxDiagram", ["require", "exports", "clickDataSaver"], function (require, exports, clickDataSaver_1) {
    "use strict";
    exports.__esModule = true;
    exports.drawRowView = exports.drawLineView = exports.drawShapeView = void 0;
    function drawShapeView(context, current_coordinate) {
        var x_pos = current_coordinate.get_x();
        var y_pos = current_coordinate.get_y();
        if (clickDataSaver_1.clickDataSaver.use_rectangle) {
            var minimal_x_half = clickDataSaver_1.clickDataSaver.minimal_width + clickDataSaver_1.clickDataSaver.grad_radius;
            var minimal_y_half = clickDataSaver_1.clickDataSaver.minimal_height + clickDataSaver_1.clickDataSaver.grad_radius;
            context.beginPath();
            context.moveTo(x_pos - minimal_x_half, y_pos - minimal_y_half);
            context.lineTo(x_pos + minimal_x_half, y_pos - minimal_y_half);
            context.lineTo(x_pos + minimal_x_half, y_pos + minimal_y_half);
            context.lineTo(x_pos - minimal_x_half, y_pos + minimal_y_half);
            context.lineTo(x_pos - minimal_x_half, y_pos - minimal_y_half);
            context.stroke();
        }
        else if (clickDataSaver_1.clickDataSaver.use_circle) {
            var radius = clickDataSaver_1.clickDataSaver.radius + clickDataSaver_1.clickDataSaver.grad_radius;
            context.beginPath();
            context.arc(x_pos, y_pos, radius, 0, 2 * Math.PI);
            context.stroke();
        }
        else if (clickDataSaver_1.clickDataSaver.use_ellipse) {
            var x_radius = clickDataSaver_1.clickDataSaver.radius_x + clickDataSaver_1.clickDataSaver.grad_radius;
            var y_radius = clickDataSaver_1.clickDataSaver.radius_y + clickDataSaver_1.clickDataSaver.grad_radius;
            context.beginPath();
            context.ellipse(x_pos, y_pos, x_radius, y_radius, 0, 0, 2 * Math.PI);
            context.stroke();
        }
    }
    exports.drawShapeView = drawShapeView;
    function drawLineView(context, current_coordinate, width) {
        var minimal_y_half;
        if (clickDataSaver_1.clickDataSaver.use_rectangle) {
            minimal_y_half = clickDataSaver_1.clickDataSaver.minimal_height + clickDataSaver_1.clickDataSaver.grad_radius;
        }
        else if (clickDataSaver_1.clickDataSaver.use_circle) {
            minimal_y_half = clickDataSaver_1.clickDataSaver.radius + clickDataSaver_1.clickDataSaver.grad_radius;
        }
        else {
            minimal_y_half = clickDataSaver_1.clickDataSaver.radius_y + clickDataSaver_1.clickDataSaver.grad_radius;
        }
        context.beginPath();
        context.moveTo(0, current_coordinate.get_y() - minimal_y_half);
        context.lineTo(width, current_coordinate.get_y() - minimal_y_half);
        context.moveTo(0, current_coordinate.get_y() + minimal_y_half);
        context.lineTo(width, current_coordinate.get_y() + minimal_y_half);
        context.stroke();
    }
    exports.drawLineView = drawLineView;
    function drawRowView(context, current_coordinate, height) {
        var minimal_x_half;
        if (clickDataSaver_1.clickDataSaver.use_rectangle) {
            minimal_x_half = clickDataSaver_1.clickDataSaver.minimal_width + clickDataSaver_1.clickDataSaver.grad_radius;
        }
        else if (clickDataSaver_1.clickDataSaver.use_circle) {
            minimal_x_half = clickDataSaver_1.clickDataSaver.radius + clickDataSaver_1.clickDataSaver.grad_radius;
        }
        else {
            minimal_x_half = clickDataSaver_1.clickDataSaver.radius_x + clickDataSaver_1.clickDataSaver.grad_radius;
        }
        context.beginPath();
        context.moveTo(current_coordinate.get_x() - minimal_x_half, 0);
        context.lineTo(current_coordinate.get_x() - minimal_x_half, height);
        context.moveTo(current_coordinate.get_x() + minimal_x_half, 0);
        context.lineTo(current_coordinate.get_x() + minimal_x_half, height);
        context.stroke();
    }
    exports.drawRowView = drawRowView;
});
define("Heatmaps", ["require", "exports", "clickDataSaver"], function (require, exports, clickDataSaver_2) {
    "use strict";
    exports.__esModule = true;
    exports.drawHorizontalHeatMap = exports.drawVerticalHeatMap = exports.drawShapeHeatMap = void 0;
    function heatMapColorForValue(value) {
        var h = (1.0 - value) * 240;
        return "hsla(" + h + ", 100%, 50%, 0.5)";
    }
    function to_index(width_idx, height_idx, max_width) {
        return height_idx * max_width + width_idx;
    }
    function fillRectangleHelper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect, maximal_y_rect, minimal_width, minimal_height, grad_radius, x, y, heat_values, time, max_width) {
        for (var i = x_min; i < x_max; i++) {
            for (var j = y_min; j < y_max; j++) {
                var idx = to_index(i, j, max_width);
                if (i >= minimal_x_rect && i <= maximal_x_rect && j >= minimal_y_rect && j <= maximal_y_rect) {
                    heat_values[idx] += time;
                }
                else {
                    var y_distance = Math.sqrt(Math.pow(y - j, 2));
                    var x_distance = Math.sqrt(Math.pow(x - i, 2));
                    var x_distance_normalized = Math.max(0, x_distance - minimal_width);
                    x_distance_normalized = Math.max(0, x_distance_normalized / grad_radius);
                    var y_distance_normalized = Math.max(0, y_distance - minimal_height);
                    y_distance_normalized = Math.max(0, y_distance_normalized / grad_radius);
                    var distance = Math.min(1, x_distance_normalized + y_distance_normalized);
                    var alpha = 1 - distance;
                    heat_values[idx] += alpha * time;
                }
            }
        }
    }
    function fillForRectangle(heat_values, x, y, max_width, max_height, time) {
        if (time === void 0) { time = 1; }
        var minimal_x_rect = x - clickDataSaver_2.clickDataSaver.minimal_width;
        var maximal_x_rect = x + clickDataSaver_2.clickDataSaver.minimal_width;
        var minimal_y_rect = y - clickDataSaver_2.clickDataSaver.minimal_height;
        var maximal_y_rect = y + clickDataSaver_2.clickDataSaver.minimal_height;
        var x_min = Math.max(x - clickDataSaver_2.clickDataSaver.minimal_width - clickDataSaver_2.clickDataSaver.grad_radius, 0);
        var x_max = Math.max(x + clickDataSaver_2.clickDataSaver.minimal_width + clickDataSaver_2.clickDataSaver.grad_radius, max_width);
        var y_min = Math.max(y - clickDataSaver_2.clickDataSaver.minimal_height - clickDataSaver_2.clickDataSaver.grad_radius, 0);
        var y_max = Math.max(y + clickDataSaver_2.clickDataSaver.minimal_height + clickDataSaver_2.clickDataSaver.grad_radius, max_height);
        fillRectangleHelper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect, maximal_y_rect, clickDataSaver_2.clickDataSaver.minimal_width, clickDataSaver_2.clickDataSaver.minimal_height, clickDataSaver_2.clickDataSaver.grad_radius, x, y, heat_values, time, max_width);
    }
    function fillForEllipse(heat_values, x, y, max_width, max_height, time) {
        if (time === void 0) { time = 1; }
        var x_min = Math.max(x - clickDataSaver_2.clickDataSaver.radius_x - clickDataSaver_2.clickDataSaver.grad_radius, 0);
        var x_max = Math.max(x + clickDataSaver_2.clickDataSaver.radius_x + clickDataSaver_2.clickDataSaver.grad_radius, max_width);
        var y_min = Math.max(y - clickDataSaver_2.clickDataSaver.radius_x - clickDataSaver_2.clickDataSaver.grad_radius, 0);
        var y_max = Math.max(y + clickDataSaver_2.clickDataSaver.radius_y + clickDataSaver_2.clickDataSaver.grad_radius, max_height);
        var x_rad_square = Math.pow(clickDataSaver_2.clickDataSaver.radius_x, 2);
        var y_rad_square = Math.pow(clickDataSaver_2.clickDataSaver.radius_y, 2);
        var x_rad_grad_square = Math.pow(clickDataSaver_2.clickDataSaver.radius_x + clickDataSaver_2.clickDataSaver.grad_radius, 2);
        var y_rad_grad_square = Math.pow(clickDataSaver_2.clickDataSaver.radius_y + clickDataSaver_2.clickDataSaver.grad_radius, 2);
        for (var height_iter = y_min; height_iter < y_max; height_iter++) {
            for (var width_iter = x_min; width_iter < x_max; width_iter++) {
                var clear = Math.pow(width_iter - x, 2) / x_rad_square + Math.pow(height_iter - y, 2) / y_rad_square <= 1;
                var inter_value = Math.pow(width_iter - x, 2) / x_rad_grad_square + Math.pow(height_iter - y, 2) / y_rad_grad_square;
                var interpolate = inter_value <= 1;
                var idx = to_index(width_iter, height_iter, max_width);
                if (clear) {
                    heat_values[idx] += time;
                }
                else if (interpolate) {
                    var x_distance = Math.abs(x - width_iter);
                    var y_distance = Math.abs(y - height_iter);
                    var x_distance_normalized = Math.max(0, x_distance - clickDataSaver_2.clickDataSaver.radius_x);
                    x_distance_normalized = Math.max(0, x_distance_normalized / clickDataSaver_2.clickDataSaver.grad_radius);
                    var y_distance_normalized = Math.max(0, y_distance - clickDataSaver_2.clickDataSaver.radius_y);
                    y_distance_normalized = Math.max(0, y_distance_normalized / clickDataSaver_2.clickDataSaver.grad_radius);
                    var distance = Math.min(1, Math.sqrt(Math.pow(x_distance_normalized, 2) + Math.pow(y_distance_normalized, 2)));
                    var alpha = 1.0 - distance;
                    heat_values[idx] += alpha * time;
                }
            }
        }
    }
    function fillForCircle(heat_values, x, y, max_width, max_height, time) {
        if (time === void 0) { time = 1; }
        var x_min = Math.max(x - clickDataSaver_2.clickDataSaver.radius - clickDataSaver_2.clickDataSaver.grad_radius, 0);
        var x_max = Math.max(x + clickDataSaver_2.clickDataSaver.radius + clickDataSaver_2.clickDataSaver.grad_radius, max_width);
        var y_min = Math.max(y - clickDataSaver_2.clickDataSaver.radius - clickDataSaver_2.clickDataSaver.grad_radius, 0);
        var y_max = Math.max(y + clickDataSaver_2.clickDataSaver.radius + clickDataSaver_2.clickDataSaver.grad_radius, max_height);
        var rad_square = Math.pow(clickDataSaver_2.clickDataSaver.radius, 2);
        var rad_grad_square = Math.pow(clickDataSaver_2.clickDataSaver.radius + clickDataSaver_2.clickDataSaver.grad_radius, 2);
        for (var height_iter = y_min; height_iter < y_max; height_iter++) {
            for (var width_iter = x_min; width_iter < x_max; width_iter++) {
                var clear = Math.pow(width_iter - x, 2) + Math.pow(height_iter - y, 2) <= rad_square;
                var inter_value = Math.pow(width_iter - x, 2) + Math.pow(height_iter - y, 2);
                var interpolate = inter_value <= rad_grad_square;
                var idx = to_index(width_iter, height_iter, max_width);
                if (clear) {
                    heat_values[idx] += time;
                }
                else if (interpolate) {
                    var x_distance = Math.abs(x - width_iter);
                    var y_distance = Math.abs(y - height_iter);
                    var x_distance_normalized = Math.max(0, x_distance - clickDataSaver_2.clickDataSaver.radius);
                    x_distance_normalized = Math.max(0, x_distance_normalized / clickDataSaver_2.clickDataSaver.grad_radius);
                    var y_distance_normalized = Math.max(0, y_distance - clickDataSaver_2.clickDataSaver.radius);
                    y_distance_normalized = Math.max(0, y_distance_normalized / clickDataSaver_2.clickDataSaver.grad_radius);
                    var distance = Math.min(1, Math.sqrt(Math.pow(x_distance_normalized, 2) + Math.pow(y_distance_normalized, 2)));
                    var alpha = 1.0 - distance;
                    heat_values[idx] += alpha * time;
                }
            }
        }
    }
    function get_time(idx) {
        var time = 1;
        if (clickDataSaver_2.clickDataSaver.use_times && idx === clickDataSaver_2.clickDataSaver.get_current_time_log().length - 1) {
            var average = clickDataSaver_2.clickDataSaver.get_current_time_log().reduce(function (pv, pc) {
                return pv + pc;
            }, 0);
            time = Math.floor(average / clickDataSaver_2.clickDataSaver.get_current_time_log().length);
        }
        else if (clickDataSaver_2.clickDataSaver.use_times) {
            time = clickDataSaver_2.clickDataSaver.get_current_time_log()[idx + 1] - clickDataSaver_2.clickDataSaver.get_current_time_log()[idx];
        }
        return time;
    }
    function normalize_heat(heat_values) {
        var max_value = 0;
        for (var i = 0; i < heat_values.length; i++) {
            if (max_value < heat_values[i]) {
                max_value = heat_values[i];
            }
        }
        for (var i = 0; i < heat_values.length; i++) {
            heat_values[i] = heat_values[i] / max_value;
        }
    }
    function draw_heat(context, heat_values, max_width, max_height) {
        context.beginPath();
        for (var i = 0; i < max_width; i++) {
            for (var j = 0; j < max_height; j++) {
                var idx = to_index(i, j, max_width);
                context.fillStyle = heatMapColorForValue(heat_values[idx]);
                context.fillRect(i, j, 1, 1);
            }
        }
        context.stroke();
    }
    function drawShapeHeatMap(context, min, max, buffer, max_width, max_height) {
        var heat_values = [];
        for (var i = 0; i < max_width * max_height; i++) {
            heat_values.push(0);
        }
        if (clickDataSaver_2.clickDataSaver.use_rectangle) {
            for (var i = min; i <= max; i++) {
                var time = get_time(i);
                fillForRectangle(heat_values, buffer[i].get_x(), buffer[i].get_y(), max_width, max_height, time);
            }
        }
        else if (clickDataSaver_2.clickDataSaver.use_circle) {
            for (var i = min; i <= max; i++) {
                var time = get_time(i);
                fillForCircle(heat_values, buffer[i].get_x(), buffer[i].get_y(), max_width, max_height, time);
            }
        }
        else if (clickDataSaver_2.clickDataSaver.use_ellipse) {
            for (var i = min; i <= max; i++) {
                var time = get_time(i);
                fillForEllipse(heat_values, buffer[i].get_x(), buffer[i].get_y(), max_width, max_height, time);
            }
        }
        var idx = to_index(buffer[0].get_x(), buffer[0].get_y(), max_width);
        normalize_heat(heat_values);
        draw_heat(context, heat_values, max_width, max_height);
        context.fillStyle = "rgba(0,0,0,1)";
    }
    exports.drawShapeHeatMap = drawShapeHeatMap;
    function drawVerticalHeatMap(context, min, max, buffer, maxWidth, maxHeight) {
        var minimal_y_half;
        var minimal_y_half_grad;
        var x = maxWidth / 2;
        if (clickDataSaver_2.clickDataSaver.use_rectangle) {
            minimal_y_half = clickDataSaver_2.clickDataSaver.minimal_height;
        }
        else if (clickDataSaver_2.clickDataSaver.use_circle) {
            minimal_y_half = clickDataSaver_2.clickDataSaver.radius;
        }
        else {
            minimal_y_half = clickDataSaver_2.clickDataSaver.radius_y;
        }
        minimal_y_half_grad = minimal_y_half + clickDataSaver_2.clickDataSaver.grad_radius;
        var heat_values = [];
        for (var i = 0; i < maxWidth * maxHeight; i++) {
            heat_values.push(0);
        }
        var minimal_width = maxWidth / 2;
        var minimal_height = minimal_y_half;
        for (var i = min; i <= max; i++) {
            var minimal_x_rect = 0;
            var maximal_x_rect = maxWidth;
            var minimal_y_rect = buffer[i].get_y() - minimal_y_half;
            var maximal_y_rect = buffer[i].get_y() + minimal_y_half;
            var x_min = minimal_x_rect;
            var x_max = maximal_x_rect;
            var y_min = Math.max(buffer[i].get_y() - minimal_y_half_grad, 0);
            var y_max = Math.min(buffer[i].get_y() + minimal_y_half_grad, maxHeight);
            var time = get_time(i);
            fillRectangleHelper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect, maximal_y_rect, minimal_width, minimal_height, clickDataSaver_2.clickDataSaver.grad_radius, x, buffer[i].get_y(), heat_values, time, maxWidth);
        }
        normalize_heat(heat_values);
        draw_heat(context, heat_values, maxWidth, maxHeight);
        context.fillStyle = "rgba(0,0,0,1)";
    }
    exports.drawVerticalHeatMap = drawVerticalHeatMap;
    function drawHorizontalHeatMap(context, min, max, buffer, maxWidth, maxHeight) {
        var minimal_x_half;
        var minimal_x_half_grad;
        var y = maxHeight / 2;
        if (clickDataSaver_2.clickDataSaver.use_rectangle) {
            minimal_x_half = clickDataSaver_2.clickDataSaver.minimal_width;
        }
        else if (clickDataSaver_2.clickDataSaver.use_circle) {
            minimal_x_half = clickDataSaver_2.clickDataSaver.radius;
        }
        else {
            minimal_x_half = clickDataSaver_2.clickDataSaver.radius_x;
        }
        minimal_x_half_grad = minimal_x_half + clickDataSaver_2.clickDataSaver.grad_radius;
        var heat_values = [];
        for (var i = 0; i < maxWidth * maxHeight; i++) {
            heat_values.push(0);
        }
        var minimal_width = minimal_x_half;
        var minimal_height = maxHeight / 2;
        for (var i = min; i <= max; i++) {
            var minimal_y_rect = 0;
            var maximal_y_rect = maxHeight;
            var y_min = minimal_y_rect;
            var y_max = maximal_y_rect;
            var minimal_x_rect = buffer[i].get_x() - minimal_x_half;
            var maximal_x_rect = buffer[i].get_x() + minimal_x_half;
            var x_min = Math.max(buffer[i].get_x() - minimal_x_half_grad, 0);
            var x_max = Math.min(buffer[i].get_x() + minimal_x_half_grad, maxWidth);
            var time = get_time(i);
            fillRectangleHelper(x_min, x_max, y_min, y_max, minimal_x_rect, maximal_x_rect, minimal_y_rect, maximal_y_rect, minimal_width, minimal_height, clickDataSaver_2.clickDataSaver.grad_radius, buffer[i].get_x(), y, heat_values, time, maxWidth);
        }
        normalize_heat(heat_values);
        draw_heat(context, heat_values, maxWidth, maxHeight);
        context.fillStyle = "rgba(0,0,0,1)";
    }
    exports.drawHorizontalHeatMap = drawHorizontalHeatMap;
});
define("LineDiagram", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.drawHorizontalLineDiagram = exports.drawVerticalLineDiagram = void 0;
    function drawVerticalLineDiagram(context, min, max, buffer, startWith) {
        if (startWith === void 0) { startWith = 3; }
        var current_x = startWith;
        context.beginPath();
        context.moveTo(current_x, buffer[0].get_y());
        for (var i = min; i <= max; i++) {
            context.lineTo(current_x, buffer[i].get_y());
            current_x += 3;
            context.lineTo(current_x, buffer[i].get_y());
        }
        context.stroke();
    }
    exports.drawVerticalLineDiagram = drawVerticalLineDiagram;
    function drawHorizontalLineDiagram(context, min, max, buffer) {
        var current_y = 1;
        context.beginPath();
        context.moveTo(buffer[0].get_x(), current_y);
        for (var i = min; i <= max; i++) {
            context.lineTo(buffer[i].get_x(), current_y);
            current_y += 3;
            context.lineTo(buffer[i].get_x(), current_y);
        }
        context.stroke();
    }
    exports.drawHorizontalLineDiagram = drawHorizontalLineDiagram;
});
define("NeedlemanWunsch", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.NeedlemanWunsch = void 0;
    var str = [];
    function getMin(current_x, current_y, sequence_a, sequence_b, matrix) {
        var topLeft = matrix[current_x - 1][current_y - 1];
        var left = matrix[current_x - 1][current_y] + 1;
        var top = matrix[current_x][current_y - 1] + 1;
        if (!(sequence_b[current_x - 1] === sequence_a[current_y - 1]))
            topLeft++;
        return Math.min(topLeft, left, top);
    }
    function backtrace(solution, sequence_a, sequence_b, matrix, x, y) {
        if (x === 0 && y === 0) {
            return;
        }
        if (x === 0) {
            str.push("top");
            solution.unshift({ kind: "delete", data: sequence_b[y - 1] });
            return backtrace(solution, sequence_a, sequence_b, matrix, x, --y);
        }
        if (y === 0) {
            str.push("left");
            solution.unshift({ kind: "insert", data: sequence_a[x - 1] });
            return backtrace(solution, sequence_a, sequence_b, matrix, --x, y);
        }
        if (matrix[y - 1][x - 1] <= matrix[y][x - 1] && matrix[y - 1][x - 1] <= matrix[y - 1][x]) {
            if (matrix[y][x] === matrix[y - 1][x - 1]) {
                str.push("keep");
                solution.unshift({ kind: "keep", data: sequence_a[x - 1] });
                return backtrace(solution, sequence_a, sequence_b, matrix, --x, --y);
            }
        }
        if (matrix[y][x - 1] <= matrix[y - 1][x]) {
            str.push("left");
            solution.unshift({ kind: "insert", data: sequence_a[x - 1] });
            return backtrace(solution, sequence_a, sequence_b, matrix, --x, y);
        }
        else {
            str.push("top");
            solution.unshift({ kind: "delete", data: sequence_b[y - 1] });
            return backtrace(solution, sequence_a, sequence_b, matrix, x, --y);
        }
    }
    function NeedlemanWunsch(sequence_a, sequence_b) {
        var matrix = [];
        for (var j = 0; j <= sequence_b.length; j++) {
            var tmp = [];
            for (var i = 0; i <= sequence_a.length; i++) {
                tmp.push(0);
            }
            matrix.push(tmp);
        }
        for (var j = 1; j <= sequence_b.length; j++) {
            matrix[j][0] = j;
        }
        for (var i = 0; i <= sequence_a.length; i++) {
            matrix[0][i] = i;
        }
        for (var j = 1; j <= sequence_b.length; j++) {
            for (var i = 1; i <= sequence_a.length; i++) {
                matrix[j][i] = getMin(j, i, sequence_a, sequence_b, matrix);
            }
        }
        var solution = [];
        str = [];
        backtrace(solution, sequence_a, sequence_b, matrix, sequence_a.length, sequence_b.length);
        return solution;
    }
    exports.NeedlemanWunsch = NeedlemanWunsch;
});
define("NeedlemanWunschLineDiagram", ["require", "exports", "NeedlemanWunsch"], function (require, exports, NeedlemanWunsch_1) {
    "use strict";
    exports.__esModule = true;
    exports.drawHorizontalCNWLineDiagram = exports.drawVerticalCNWLineDiagram = exports.drawHorizontalNeedlemanWunschLineDiagram = exports.drawVerticalNeedlemanWunschLineDiagram = void 0;
    function roundWithOffset(offset, rounding, value) {
        var tmp1 = value;
        var tmp2 = tmp1 % rounding;
        var tmp3 = (tmp1 - tmp2) + offset;
        return tmp3;
    }
    function toUseableBuffer(solution_buffer, useDeleted) {
        if (useDeleted === void 0) { useDeleted = true; }
        var usable_buffer = [];
        for (var i = 0; i < solution_buffer.length; i++) {
            if (useDeleted == false && solution_buffer[i].kind === "delete") {
                continue;
            }
            usable_buffer.push(solution_buffer[i].data);
        }
        return usable_buffer;
    }
    function getColor(kind) {
        if (kind === "delete")
            return { r: 255, g: 0, b: 0 };
        if (kind === "insert")
            return { r: 0, g: 255, b: 0 };
        if (kind === "missmatch")
            return { r: 0, g: 0, b: 255 };
        return { r: 0, g: 0, b: 0 };
    }
    function setColor(context, color) {
        context.strokeStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
        context.fillStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
    }
    function drawVerticalNeedlemanWunschLineDiagram(context, rounding, width, buffer_a, buffer_b) {
        var buffer_needle_a = [];
        var buffer_needle_b = [];
        var rounding_half = rounding / 2.0;
        for (var i = 0; i < buffer_a.length; i++) {
            buffer_needle_a.push(roundWithOffset(rounding_half, rounding, buffer_a[i].get_y()));
        }
        for (var i = 0; i < buffer_b.length; i++) {
            buffer_needle_b.push(roundWithOffset(rounding_half, rounding, buffer_b[i].get_y()));
        }
        var buffer = NeedlemanWunsch_1.NeedlemanWunsch(buffer_needle_a, buffer_needle_b);
        var current_x = width;
        var color = { r: 0, g: 0, b: 0 };
        current_x = 3;
        context.beginPath();
        context.moveTo(current_x, buffer[0].data);
        setColor(context, { r: 0, g: 0, b: 0 });
        for (var i = 0; i < buffer.length; i++) {
            if (buffer[i].kind === "delete" || buffer[i].kind === "missmatch") {
                continue;
            }
            context.lineTo(current_x, buffer[i].data);
            current_x += 3;
            context.lineTo(current_x, buffer[i].data);
        }
        context.stroke();
    }
    exports.drawVerticalNeedlemanWunschLineDiagram = drawVerticalNeedlemanWunschLineDiagram;
    function drawHorizontalNeedlemanWunschLineDiagram(context, rounding, height, buffer_a, buffer_b) {
        var buffer_needle_a = [];
        var buffer_needle_b = [];
        var rounding_half = rounding / 2.0;
        for (var i = 0; i < buffer_a.length; i++) {
            buffer_needle_a.push(roundWithOffset(rounding_half, rounding, buffer_a[i].get_x()));
        }
        for (var i = 0; i <= buffer_b.length; i++) {
            buffer_needle_b.push(roundWithOffset(rounding_half, rounding, buffer_b[i].get_x()));
        }
        var buffer = NeedlemanWunsch_1.NeedlemanWunsch(buffer_needle_a, buffer_needle_b);
        var current_y = height;
        var color = { r: 0, g: 0, b: 0 };
        for (var i = 1; i < buffer.length; i++) {
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
        setColor(context, { r: 0, g: 0, b: 0 });
        for (var i = 0; i < buffer.length; i++) {
            if (buffer[i].kind === "delete" || buffer[i].kind === "missmatch") {
                continue;
            }
            context.lineTo(buffer[i].data, current_y);
            current_y += 3;
            context.lineTo(buffer[i].data, current_y);
        }
        context.stroke();
    }
    exports.drawHorizontalNeedlemanWunschLineDiagram = drawHorizontalNeedlemanWunschLineDiagram;
    function drawVerticalCNWLineDiagram(context, rounding, buffers) {
        var buffers_needle = [];
        var rounding_half = rounding / 2.0;
        for (var i = 0; i < buffers.length; i++) {
            var tmp_buffer = [];
            for (var j = 0; j < buffers[i].length; j++) {
                tmp_buffer.push(roundWithOffset(rounding_half, rounding, buffers[i][j].get_y()));
            }
            buffers_needle.push(tmp_buffer);
        }
        var current_sol = buffers_needle[0];
        for (var i = 1; i < buffers_needle.length; i++) {
            var sol_buffer = NeedlemanWunsch_1.NeedlemanWunsch(buffers_needle[i], current_sol);
            current_sol = toUseableBuffer(sol_buffer, false);
        }
        var buffer = current_sol;
        var current_x = 3;
        context.beginPath();
        context.moveTo(current_x, buffer[0].data);
        setColor(context, { r: 0, g: 0, b: 0 });
        for (var i = 0; i < buffer.length; i++) {
            context.lineTo(current_x, buffer[i]);
            current_x += 3;
            context.lineTo(current_x, buffer[i]);
        }
        context.stroke();
    }
    exports.drawVerticalCNWLineDiagram = drawVerticalCNWLineDiagram;
    function drawHorizontalCNWLineDiagram(context, rounding, buffers) {
        var rounding_half = rounding / 2.0;
        var buffers_needle = [];
        for (var i = 0; i < buffers.length; i++) {
            var tmp_buffer = [];
            for (var j = 0; j < buffers[i].length; j++) {
                tmp_buffer.push(roundWithOffset(rounding_half, rounding, buffers[i][j].get_x()));
            }
            buffers_needle.push(tmp_buffer);
        }
        var current_sol = buffers_needle[0];
        for (var i = 1; i < buffers_needle.length; i++) {
            var sol_buffer = NeedlemanWunsch_1.NeedlemanWunsch(buffers_needle[i], current_sol);
            current_sol = toUseableBuffer(sol_buffer);
        }
        var buffer = current_sol;
        var current_y = 3;
        context.beginPath();
        context.moveTo(buffer[0].data, current_y);
        setColor(context, { r: 0, g: 0, b: 0 });
        for (var i = 0; i < buffer.length; i++) {
            context.lineTo(buffer[i], current_y);
            current_y += 3;
            context.lineTo(buffer[i], current_y);
        }
        context.stroke();
    }
    exports.drawHorizontalCNWLineDiagram = drawHorizontalCNWLineDiagram;
});
define("SemanticClassifier", ["require", "exports", "Coordinate"], function (require, exports, Coordinate_2) {
    "use strict";
    exports.__esModule = true;
    exports.SemanticClassifier = void 0;
    var SemanticClassifier = (function () {
        function SemanticClassifier(height) {
            this.semanticFields = null;
            this.height = null;
            this.height = height;
            this.semanticFields = [];
            for (var i = 0; i < height; i++) {
                this.semanticFields.push("N");
            }
        }
        SemanticClassifier.prototype.setSemanticFields = function (start, end, value) {
            for (var i = start; i < end; i++) {
                this.semanticFields[i] = value;
            }
        };
        SemanticClassifier.prototype.getSemanticFields = function () {
            var result = [];
            var start = 0;
            var current = this.semanticFields[0];
            for (var i = 0; i < this.height; i++) {
                if (this.semanticFields[i] != current) {
                    result.push([start, i, current]);
                    start = i;
                    current = this.semanticFields[i];
                }
            }
            result.push([start, this.height, current]);
            return result;
        };
        SemanticClassifier.prototype.alignToClassifier = function (buffer) {
            var tmpBuffer = [];
            var semanticField = this.getSemanticFields();
            for (var _i = 0, buffer_1 = buffer; _i < buffer_1.length; _i++) {
                var coordinate = buffer_1[_i];
                var value = coordinate.get_y();
                var new_value = this.alignToSemanticField(semanticField, value);
                tmpBuffer.push(new Coordinate_2.Coordinate(coordinate.get_x(), new_value));
            }
            return tmpBuffer;
        };
        SemanticClassifier.prototype.drawSemanticFields = function (context, width) {
            var fields = this.getSemanticFields();
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                context.beginPath();
                context.moveTo(0, field[1]);
                context.lineTo(width * 2, field[1]);
                context.stroke();
                this.drawLetter(context, width, field[0] + 3, field[2]);
            }
        };
        SemanticClassifier.prototype.drawToLabel = function (buffer, min, max, label) {
            var semanticBuffer = this.getSemanticFields();
            var resultStr = "";
            for (var i = min; i <= max; i++) {
                try {
                    var intervalOfPoint = this.getFieldOfPoint(semanticBuffer, buffer[i].get_y());
                    var strValue = intervalOfPoint[2];
                    resultStr = resultStr.concat(strValue.toString());
                    if (i != max) {
                        resultStr = resultStr.concat(" - ");
                    }
                }
                catch (error) {
                }
            }
            label.innerText = resultStr.toString();
        };
        SemanticClassifier.prototype.clear = function () {
            for (var i = 0; i < this.height; i++) {
                this.semanticFields[i] = "N";
            }
        };
        SemanticClassifier.prototype.import_semantic_classifier_from_JSON = function (imported_Object) {
            if ("semanticClassifier" in imported_Object) {
                var data_array = imported_Object["semanticClassifier"];
                for (var i = 0; i < data_array.length; i++) {
                    var elemt = data_array[i];
                    var top_1 = elemt["top"];
                    var bot = elemt["bot"];
                    var classifier = elemt["classifier"];
                    this.setSemanticFields(top_1, bot, classifier);
                }
            }
        };
        SemanticClassifier.prototype.add_current_to_object = function (object_to_add_on) {
            var classifiers = this.getSemanticFields();
            var dataToAdd = [];
            for (var i = 0; i < classifiers.length; i++) {
                var tmp = {
                    top: classifiers[i][0],
                    bot: classifiers[i][1],
                    classifier: classifiers[i][2]
                };
                dataToAdd.push(tmp);
            }
            object_to_add_on["semanticClassifier"] = dataToAdd;
            return object_to_add_on;
        };
        SemanticClassifier.prototype.getFieldOfPoint = function (semanticField, value) {
            for (var i = 0; i < semanticField.length; i++) {
                if (value >= semanticField[i][0] && value < semanticField[i][1]) {
                    return [semanticField[i][0], semanticField[i][1], semanticField[i][2]];
                }
            }
            return null;
        };
        SemanticClassifier.prototype.alignToSemanticField = function (semanticField, value) {
            for (var i = 0; i < semanticField.length; i++) {
                if (value >= semanticField[i][0] && value < semanticField[i][1]) {
                    return Math.floor((semanticField[i][1] + semanticField[i][0]) / 2);
                }
            }
            return 0;
        };
        SemanticClassifier.prototype.drawN = function (context, startWidth, startHeight) {
            context.beginPath();
            context.moveTo(startWidth, startHeight + 10);
            context.lineTo(startWidth, startHeight);
            context.lineTo(startWidth + 8, startHeight + 10);
            context.lineTo(startWidth + 8, startHeight);
            context.stroke();
        };
        SemanticClassifier.prototype.drawS = function (context, startWidth, startHeight) {
            context.beginPath();
            context.moveTo(startWidth + 8, startHeight);
            context.lineTo(startWidth, startHeight);
            context.lineTo(startWidth, startHeight + 5);
            context.lineTo(startWidth + 8, startHeight + 5);
            context.lineTo(startWidth + 8, startHeight + 10);
            context.lineTo(startWidth, startHeight + 10);
            context.stroke();
        };
        SemanticClassifier.prototype.drawE = function (context, startWidth, startHeight) {
            context.beginPath();
            context.moveTo(startWidth + 8, startHeight);
            context.lineTo(startWidth, startHeight);
            context.lineTo(startWidth, startHeight + 5);
            context.lineTo(startWidth + 8, startHeight + 5);
            context.lineTo(startWidth, startHeight + 5);
            context.lineTo(startWidth, startHeight + 10);
            context.lineTo(startWidth + 8, startHeight + 10);
            context.stroke();
        };
        SemanticClassifier.prototype.drawI = function (context, startWidth, startHeight) {
            context.beginPath();
            context.moveTo(startWidth, startHeight);
            context.lineTo(startWidth + 8, startHeight);
            context.lineTo(startWidth + 4, startHeight);
            context.lineTo(startWidth + 4, startHeight + 10);
            context.lineTo(startWidth + 8, startHeight + 10);
            context.lineTo(startWidth, startHeight + 10);
            context.stroke();
        };
        SemanticClassifier.prototype.drawLetter = function (context, startWidth, startHeight, letter) {
            if (letter === "N")
                this.drawN(context, startWidth, startHeight);
            if (letter === "I")
                this.drawI(context, startWidth, startHeight);
            if (letter === "S")
                this.drawS(context, startWidth, startHeight);
            if (letter === "E")
                this.drawE(context, startWidth, startHeight);
        };
        return SemanticClassifier;
    }());
    exports.SemanticClassifier = SemanticClassifier;
});
define("Utils", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.set_data_for_scrollbar = exports.download = exports.loadFile = void 0;
    function loadFile(filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, xmlhttp;
            return __generator(this, function (_a) {
                result = null;
                xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", filePath, false, "root", "root");
                xmlhttp.send();
                if (xmlhttp.status == 200) {
                    result = xmlhttp.responseText;
                }
                return [2, result];
            });
        });
    }
    exports.loadFile = loadFile;
    function download(filename, text) {
        return __awaiter(this, void 0, void 0, function () {
            var element;
            return __generator(this, function (_a) {
                element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                return [2];
            });
        });
    }
    exports.download = download;
    function set_data_for_scrollbar(scrollbar, min, max, value) {
        scrollbar.min = min;
        scrollbar.max = max;
        scrollbar.value = value;
    }
    exports.set_data_for_scrollbar = set_data_for_scrollbar;
});
define("htmlImports", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.image = exports.ctx = exports.canvas = exports.EllipseSubmitButton = exports.EllipseGradientRadiusInput = exports.EllipseYRadiusInput = exports.EllipseXRadiusInput = exports.CircleSubmitButton = exports.CircleGradientRadiusInput = exports.CircleRadiusInput = exports.RectangleSubmitButton = exports.RectangleGradientRadiusInput = exports.RectangleMinimalHeightInput = exports.RectangleMinimalWidthInput = exports.DataSetSaveAsButton = exports.DataSetLoadButton = exports.DataSetInput = exports.SemanticClassifierOutput = exports.SemanticClassifierCheckBoxExpression = exports.SemanticClassifierCheckBoxStructural = exports.SemanticClassifierCheckBoxIdentifier = exports.SemanticClassifierCheckBoxNone = exports.SemanticClassifierCheckBoxShow = exports.SemanticClassifierCNWFlag = exports.SemanticClassifierSNWFlag = exports.CNWGoButton = exports.CNWResetButton = exports.CNWPushButton = exports.CNWDataPreview = exports.CNWDataInput = exports.CNWRoundingInput = exports.SNWGoButton = exports.SNWDataInput2 = exports.SNWDataInput1 = exports.SNWRoundingInput = exports.dataSetNumberOutput = exports.dataDataAnalysisButton = exports.timeDataAnalysisInput = exports.dataDataAnalysisInput = exports.imageDataAnalysisButton = exports.imageDataAnalysisInput = exports.rectangleHeatmapCheckbox = exports.horizontalHeatmapCheckbox = exports.verticalHeatmapCheckbox = exports.horizontalViewCheckbox = exports.verticalViewCheckbox = exports.rectangleViewCheckbox = exports.rowViewCheckbox = exports.lineViewCheckBox = exports.clickLogDataSetBar = exports.clickLogActivationBarMin = exports.clickLogActivationBarMax = exports.semanticClassifierCanvas = exports.clickLogCanvas = void 0;
    exports.clickLogCanvas = document.getElementById("click-log-canvas");
    exports.semanticClassifierCanvas = document.getElementById("semantic-classifier");
    exports.clickLogActivationBarMax = document.getElementById("clickLogActivationBarMax");
    exports.clickLogActivationBarMin = document.getElementById("clickLogActivationBarMin");
    exports.clickLogDataSetBar = document.getElementById("clickLogDataSetBar");
    exports.lineViewCheckBox = document.getElementById("lineViewCheckbox");
    exports.rowViewCheckbox = document.getElementById("rowViewCheckbox");
    exports.rectangleViewCheckbox = document.getElementById("rectangleViewCheckbox");
    exports.verticalViewCheckbox = document.getElementById("verticalViewCheckbox");
    exports.horizontalViewCheckbox = document.getElementById("horizontalViewCheckbox");
    exports.verticalHeatmapCheckbox = document.getElementById("verticalHeatmapCheckbox");
    exports.horizontalHeatmapCheckbox = document.getElementById("horizontalHeatmapCheckbox");
    exports.rectangleHeatmapCheckbox = document.getElementById("rectangleHeatmapCheckbox");
    exports.imageDataAnalysisInput = document.getElementById("imageDataAnalysisInput");
    exports.imageDataAnalysisButton = document.getElementById("imageDataAnalysisButton");
    exports.timeDataAnalysisInput = document.getElementById("timeDataAnalysisInput");
    exports.dataDataAnalysisInput = document.getElementById("dataDataAnalysisInput");
    exports.dataDataAnalysisButton = document.getElementById("dataDataAnalysisButton");
    exports.SNWRoundingInput = document.getElementById("SNW_rounding");
    exports.SNWDataInput1 = document.getElementById("SNW_Input1");
    exports.SNWDataInput2 = document.getElementById("SNW_Input2");
    exports.SNWGoButton = document.getElementById("SNW_go");
    exports.CNWRoundingInput = document.getElementById("CNW_rounding");
    exports.CNWDataInput = document.getElementById("CNW_Input");
    exports.CNWDataPreview = document.getElementById("CNW_Preview");
    exports.CNWPushButton = document.getElementById("CNW_push");
    exports.CNWResetButton = document.getElementById("CNW_reset");
    exports.CNWGoButton = document.getElementById("CNW_go");
    exports.SemanticClassifierSNWFlag = document.getElementById("SemanticClassifierSNWFlag");
    exports.SemanticClassifierCNWFlag = document.getElementById("SemanticClassifierCNWFlag");
    exports.dataSetNumberOutput = document.getElementById("currentDataSetLabel");
    exports.SemanticClassifierCheckBoxShow = document.getElementById("SemanticClassifierCheckBoxShow");
    exports.SemanticClassifierCheckBoxNone = document.getElementById("SemanticClassifierCheckBoxNone");
    exports.SemanticClassifierCheckBoxIdentifier = document.getElementById("SemanticClassifierCheckBoxIdentifier");
    exports.SemanticClassifierCheckBoxStructural = document.getElementById("SemanticClassifierCheckBoxStructural");
    exports.SemanticClassifierCheckBoxExpression = document.getElementById("SemanticClassifierCheckBoxExpression");
    exports.SemanticClassifierOutput = document.getElementById("SemanticClassifierOutput");
    exports.DataSetInput = document.getElementById("datasetInput");
    exports.DataSetLoadButton = document.getElementById("datasetLoadButton");
    exports.DataSetSaveAsButton = document.getElementById("datasetSaveAsButton");
    exports.RectangleMinimalWidthInput = document.getElementById("minimalWidthInput");
    exports.RectangleMinimalHeightInput = document.getElementById("minimalHeightInput");
    exports.RectangleGradientRadiusInput = document.getElementById("rectangleGradRadiusInput");
    exports.RectangleSubmitButton = document.getElementById("useRectangle");
    exports.CircleRadiusInput = document.getElementById("radiusInput");
    exports.CircleGradientRadiusInput = document.getElementById("circleGradRadiusInput");
    exports.CircleSubmitButton = document.getElementById("useCircle");
    exports.EllipseXRadiusInput = document.getElementById("xRadiusInput");
    exports.EllipseYRadiusInput = document.getElementById("yRadiusInput");
    exports.EllipseGradientRadiusInput = document.getElementById("ellipseGradRadiusInput");
    exports.EllipseSubmitButton = document.getElementById("useEllipse");
    exports.canvas = document.getElementById("bubble-image-canvas");
    exports.ctx = exports.canvas.getContext("2d");
    exports.image = new Image();
});
define("index", ["require", "exports", "clickDataSaver", "BoxDiagram", "LineDiagram", "Heatmaps", "SemanticClassifier", "htmlImports", "NeedlemanWunschLineDiagram", "Utils"], function (require, exports, clickDataSaver_3, BoxDiagram_1, LineDiagram_1, Heatmaps_1, SemanticClassifier_1, html_doc, NW, Utils) {
    "use strict";
    exports.__esModule = true;
    var semanticClassifier = null;
    var shouldRenderNew = true;
    var redrawClickLog = false;
    var drawSNW = false;
    var drawCNW = false;
    var imageUrl;
    var indicatorCNWBuffers = [];
    var semanticClassifier_top = null;
    var semanticClassifier_bottom = null;
    var importedData = null;
    function setRedrawClickLog() {
        redrawClickLog = true;
        drawSNW = false;
        drawCNW = false;
    }
    function setDrawSNW() {
        redrawClickLog = false;
        drawSNW = true;
        drawCNW = false;
    }
    function setDrawCNW() {
        redrawClickLog = false;
        drawSNW = false;
        drawCNW = true;
    }
    html_doc.imageDataAnalysisButton.addEventListener('click', function () {
        clickDataSaver_3.clickDataSaver.imageWithDataOfClickLog = html_doc.imageDataAnalysisInput.value;
        clickDataSaver_3.clickDataSaver.clickLogData = [];
        indicatorCNWBuffers = [];
        imageUrl = clickDataSaver_3.clickDataSaver.imageWithDataOfClickLog;
        Utils.set_data_for_scrollbar(html_doc.clickLogDataSetBar, String(0), String(0), String(0));
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(0), String(0));
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
        shouldRenderNew = true;
    });
    html_doc.image.onload = function () {
        html_doc.canvas.width = 2 * html_doc.image.width;
        html_doc.canvas.height = html_doc.image.height;
        html_doc.clickLogCanvas.width = 2 * html_doc.image.width;
        html_doc.clickLogCanvas.height = html_doc.image.height;
        html_doc.semanticClassifierCanvas.width = 2 * html_doc.image.width;
        html_doc.semanticClassifierCanvas.height = html_doc.image.height;
        html_doc.ctx.drawImage(html_doc.image, 0, 0, html_doc.image.width, html_doc.image.height);
        semanticClassifier = new SemanticClassifier_1.SemanticClassifier(html_doc.image.height);
        clickDataSaver_3.clickDataSaver.clear_current_log();
        clickDataSaver_3.clickDataSaver.imageWithDataOfClickLog = html_doc.image.src;
        if (importedData != null) {
            clickDataSaver_3.clickDataSaver.set_current_log(importedData);
            semanticClassifier.import_semantic_classifier_from_JSON(importedData);
            Utils.set_data_for_scrollbar(html_doc.clickLogDataSetBar, String(0), String(clickDataSaver_3.clickDataSaver.clickLogData.length - 1), String(0));
            html_doc.dataSetNumberOutput.innerHTML = "0";
            Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(clickDataSaver_3.clickDataSaver.get_current_log().length - 1), String(0));
            Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
        }
        else {
            Utils.set_data_for_scrollbar(html_doc.clickLogDataSetBar, String(0), String(0), String(-1));
            Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
            Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(0), String(0));
        }
        shouldRenderNew = false;
    };
    html_doc.dataDataAnalysisButton.addEventListener('click', function () {
        clickDataSaver_3.clickDataSaver.string_to_click_log(html_doc.dataDataAnalysisInput.value);
        clickDataSaver_3.clickDataSaver.string_to_time_log(html_doc.timeDataAnalysisInput.value);
        indicatorCNWBuffers.push(false);
        html_doc.clickLogDataSetBar.max = String(clickDataSaver_3.clickDataSaver.clickLogData.length - 1);
        if (clickDataSaver_3.clickDataSaver.clickLogData.length === 1) {
            clickDataSaver_3.clickDataSaver.current = 0;
            html_doc.dataSetNumberOutput.innerHTML = "" + clickDataSaver_3.clickDataSaver.current;
            Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
            Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(clickDataSaver_3.clickDataSaver.get_current_log().length - 1), String(0));
            setRedrawClickLog();
        }
    });
    html_doc.clickLogActivationBarMax.oninput = function () {
        setRedrawClickLog();
        var min = String(0);
        var max = String(html_doc.clickLogActivationBarMax.value);
        var value = String(Math.min(Number(html_doc.clickLogActivationBarMin.value), Number(html_doc.clickLogActivationBarMax.value)));
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, min, max, value);
    };
    html_doc.clickLogDataSetBar.oninput = function () {
        clickDataSaver_3.clickDataSaver.current = Number(html_doc.clickLogDataSetBar.value);
        html_doc.dataSetNumberOutput.innerHTML = "" + clickDataSaver_3.clickDataSaver.current;
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(clickDataSaver_3.clickDataSaver.get_current_log().length - 1), String(0));
        setRedrawClickLog();
    };
    html_doc.SemanticClassifierCheckBoxNone.oninput = function () {
        html_doc.SemanticClassifierCheckBoxIdentifier.checked = false;
        html_doc.SemanticClassifierCheckBoxExpression.checked = false;
        html_doc.SemanticClassifierCheckBoxStructural.checked = false;
        html_doc.SemanticClassifierCheckBoxNone.checked = true;
    };
    html_doc.SemanticClassifierCheckBoxIdentifier.oninput = function () {
        html_doc.SemanticClassifierCheckBoxIdentifier.checked = true;
        html_doc.SemanticClassifierCheckBoxExpression.checked = false;
        html_doc.SemanticClassifierCheckBoxStructural.checked = false;
        html_doc.SemanticClassifierCheckBoxNone.checked = false;
    };
    html_doc.SemanticClassifierCheckBoxExpression.oninput = function () {
        html_doc.SemanticClassifierCheckBoxIdentifier.checked = false;
        html_doc.SemanticClassifierCheckBoxExpression.checked = true;
        html_doc.SemanticClassifierCheckBoxStructural.checked = false;
        html_doc.SemanticClassifierCheckBoxNone.checked = false;
    };
    html_doc.SemanticClassifierCheckBoxStructural.oninput = function () {
        html_doc.SemanticClassifierCheckBoxIdentifier.checked = false;
        html_doc.SemanticClassifierCheckBoxExpression.checked = false;
        html_doc.SemanticClassifierCheckBoxStructural.checked = true;
        html_doc.SemanticClassifierCheckBoxNone.checked = false;
    };
    function get_semantic_value() {
        if (html_doc.SemanticClassifierCheckBoxIdentifier.checked)
            return "I";
        if (html_doc.SemanticClassifierCheckBoxExpression.checked)
            return "E";
        if (html_doc.SemanticClassifierCheckBoxStructural.checked)
            return "S";
        return "N";
    }
    html_doc.clickLogCanvas.addEventListener("mousedown", function (event) {
        if (event.button === 0) {
            var mouseY = Math.floor(event.y - html_doc.clickLogCanvas.getBoundingClientRect().top);
            if (event.shiftKey) {
                semanticClassifier_top = mouseY;
                if (semanticClassifier_bottom != null && semanticClassifier_bottom <= semanticClassifier_top) {
                    semanticClassifier_bottom = semanticClassifier_top + 1;
                }
            }
            if (event.ctrlKey) {
                semanticClassifier_bottom = mouseY + 1;
                if (semanticClassifier_top != null && semanticClassifier_top >= semanticClassifier_bottom) {
                    semanticClassifier_top = mouseY;
                }
            }
        }
    });
    html_doc.DataSetLoadButton.addEventListener("click", function () {
        return __awaiter(this, void 0, void 0, function () {
            var fileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileName = html_doc.DataSetInput.value;
                        return [4, loadDataFrom(fileName)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    html_doc.DataSetSaveAsButton.addEventListener("click", function () {
        return __awaiter(this, void 0, void 0, function () {
            var fileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileName = html_doc.DataSetInput.value;
                        return [4, saveDataTo(fileName)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    var redrawIndicator = function () {
        setRedrawClickLog();
    };
    html_doc.clickLogActivationBarMin.oninput = redrawIndicator;
    html_doc.lineViewCheckBox.oninput = redrawIndicator;
    html_doc.rowViewCheckbox.oninput = redrawIndicator;
    html_doc.rectangleViewCheckbox.oninput = redrawIndicator;
    html_doc.verticalViewCheckbox.oninput = redrawIndicator;
    html_doc.horizontalViewCheckbox.oninput = redrawIndicator;
    html_doc.verticalHeatmapCheckbox.oninput = redrawIndicator;
    html_doc.horizontalHeatmapCheckbox.oninput = redrawIndicator;
    html_doc.rectangleHeatmapCheckbox.oninput = redrawIndicator;
    html_doc.SemanticClassifierCheckBoxShow.oninput = redrawIndicator;
    html_doc.SNWGoButton.addEventListener('click', function () {
        setDrawSNW();
    });
    html_doc.CNWGoButton.addEventListener('click', function () {
        setDrawCNW();
    });
    html_doc.CNWPushButton.addEventListener('click', function () {
        var dataString = html_doc.CNWDataInput.value;
        var dataArray = dataString.split(" ");
        for (var i = 0; i < dataArray.length; i++) {
            var number = Number(dataArray[i]);
            if (number >= 0 && number < clickDataSaver_3.clickDataSaver.clickLogData.length) {
                indicatorCNWBuffers[number] = true;
            }
        }
        html_doc.CNWDataInput.value = "";
        var OutputStr = "";
        for (var i = 0; i < clickDataSaver_3.clickDataSaver.clickLogData.length; i++) {
            if (indicatorCNWBuffers[i] === true) {
                OutputStr = OutputStr + (" " + i);
            }
        }
        html_doc.CNWDataPreview.value = OutputStr;
    });
    html_doc.CNWResetButton.addEventListener('click', function () {
        for (var i = 0; i < clickDataSaver_3.clickDataSaver.clickLogData.length; i++) {
            indicatorCNWBuffers[i] = false;
        }
        html_doc.CNWDataPreview.value = "[None]";
    });
    html_doc.RectangleSubmitButton.addEventListener('click', function () {
        clickDataSaver_3.clickDataSaver.minimal_width = parseInt(html_doc.RectangleMinimalWidthInput.value);
        clickDataSaver_3.clickDataSaver.minimal_height = parseInt(html_doc.RectangleMinimalHeightInput.value);
        clickDataSaver_3.clickDataSaver.grad_radius = parseInt(html_doc.RectangleGradientRadiusInput.value);
        clickDataSaver_3.clickDataSaver.use_rectangle = true;
        clickDataSaver_3.clickDataSaver.use_circle = false;
        clickDataSaver_3.clickDataSaver.use_ellipse = false;
        setRedrawClickLog();
    });
    html_doc.CircleSubmitButton.addEventListener('click', function () {
        clickDataSaver_3.clickDataSaver.radius = parseInt(html_doc.CircleRadiusInput.value);
        clickDataSaver_3.clickDataSaver.grad_radius = parseInt(html_doc.CircleGradientRadiusInput.value);
        clickDataSaver_3.clickDataSaver.use_rectangle = false;
        clickDataSaver_3.clickDataSaver.use_circle = true;
        clickDataSaver_3.clickDataSaver.use_ellipse = false;
        setRedrawClickLog();
    });
    html_doc.EllipseSubmitButton.addEventListener('click', function () {
        clickDataSaver_3.clickDataSaver.radius_x = parseInt(html_doc.EllipseXRadiusInput.value);
        clickDataSaver_3.clickDataSaver.radius_y = parseInt(html_doc.EllipseYRadiusInput.value);
        clickDataSaver_3.clickDataSaver.grad_radius = parseInt(html_doc.EllipseGradientRadiusInput.value);
        clickDataSaver_3.clickDataSaver.use_rectangle = false;
        clickDataSaver_3.clickDataSaver.use_circle = false;
        clickDataSaver_3.clickDataSaver.use_ellipse = true;
        setRedrawClickLog();
    });
    function loadDataFrom(filename) {
        return __awaiter(this, void 0, void 0, function () {
            var JSONData, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4, Utils.loadFile("data/" + filename)];
                    case 1:
                        JSONData = _b.apply(_a, [_c.sent()]);
                        imageUrl = clickDataSaver_3.clickDataSaver.imageWithDataOfClickLog;
                        html_doc.image.src = imageUrl;
                        importedData = JSONData;
                        return [2];
                }
            });
        });
    }
    function saveDataTo(filename) {
        return __awaiter(this, void 0, void 0, function () {
            var dataObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dataObject = {};
                        clickDataSaver_3.clickDataSaver.imageWithDataOfClickLog = imageUrl;
                        dataObject = clickDataSaver_3.clickDataSaver.add_current_to_object(dataObject);
                        dataObject = semanticClassifier.add_current_to_object(dataObject);
                        return [4, Utils.download(filename, JSON.stringify(dataObject))];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    }
    function drawClickLog() {
        var context = html_doc.clickLogCanvas.getContext("2d");
        context.clearRect(0, 0, html_doc.clickLogCanvas.width, html_doc.clickLogCanvas.height);
        var buffer = clickDataSaver_3.clickDataSaver.get_current_log();
        var maxLog = Number(html_doc.clickLogActivationBarMax.value);
        var minLog = Number(html_doc.clickLogActivationBarMin.value);
        var lineView = html_doc.lineViewCheckBox.checked;
        var rowView = html_doc.rowViewCheckbox.checked;
        var rectangleView = html_doc.rectangleViewCheckbox.checked;
        var verticalView = html_doc.verticalViewCheckbox.checked;
        var horizontalView = html_doc.horizontalViewCheckbox.checked;
        var verticalHeatMap = html_doc.verticalHeatmapCheckbox.checked;
        var horizontalHeatMap = html_doc.horizontalHeatmapCheckbox.checked;
        var rectangleHeatMap = html_doc.rectangleHeatmapCheckbox.checked;
        if (rectangleView === true)
            BoxDiagram_1.drawShapeView(context, buffer[maxLog]);
        if (lineView === true)
            BoxDiagram_1.drawLineView(context, buffer[maxLog], html_doc.image.width);
        if (rowView === true)
            BoxDiagram_1.drawRowView(context, buffer[maxLog], html_doc.image.height);
        if (verticalView === true)
            LineDiagram_1.drawVerticalLineDiagram(context, minLog, maxLog, buffer, html_doc.image.width);
        if (horizontalView === true)
            LineDiagram_1.drawHorizontalLineDiagram(context, minLog, maxLog, buffer);
        if (verticalHeatMap === true)
            Heatmaps_1.drawVerticalHeatMap(context, minLog, maxLog, buffer, html_doc.image.width, html_doc.image.height);
        if (horizontalHeatMap === true)
            Heatmaps_1.drawHorizontalHeatMap(context, minLog, maxLog, buffer, html_doc.image.width, html_doc.image.height);
        if (rectangleHeatMap === true)
            Heatmaps_1.drawShapeHeatMap(context, minLog, maxLog, buffer, html_doc.image.width, html_doc.image.height);
        semanticClassifier.drawToLabel(buffer, minLog, maxLog, html_doc.SemanticClassifierOutput);
    }
    function drawVerticalSNW() {
        var context = html_doc.clickLogCanvas.getContext("2d");
        context.clearRect(0, 0, html_doc.clickLogCanvas.width, html_doc.clickLogCanvas.height);
        var buffer1Number = Number(html_doc.SNWDataInput1.value);
        var buffer2Number = Number(html_doc.SNWDataInput2.value);
        var rounding = Number(html_doc.SNWRoundingInput.value);
        if (buffer1Number >= 0 && buffer1Number < clickDataSaver_3.clickDataSaver.clickLogData.length) {
            if (buffer2Number >= 0 && buffer2Number < clickDataSaver_3.clickDataSaver.clickLogData.length) {
                var coordinate1Buffer = clickDataSaver_3.clickDataSaver.clickLogData[buffer1Number];
                var coordinate2Buffer = clickDataSaver_3.clickDataSaver.clickLogData[buffer2Number];
                if (html_doc.SemanticClassifierSNWFlag.checked) {
                    coordinate1Buffer = semanticClassifier.alignToClassifier(coordinate1Buffer);
                    coordinate2Buffer = semanticClassifier.alignToClassifier(coordinate2Buffer);
                    rounding = 1;
                }
                NW.drawVerticalNeedlemanWunschLineDiagram(context, rounding, html_doc.image.width, coordinate1Buffer, coordinate2Buffer);
            }
            else {
                console.log("Number " + buffer2Number + " not in dataset");
            }
        }
        else {
            console.log("Number " + buffer2Number + " not in dataset");
        }
    }
    function drawVerticalCNW() {
        var context = html_doc.clickLogCanvas.getContext("2d");
        context.clearRect(0, 0, html_doc.clickLogCanvas.width, html_doc.clickLogCanvas.height);
        var buffers = [];
        var rounding = Number(html_doc.CNWRoundingInput.value);
        for (var i = 0; i < indicatorCNWBuffers.length; i++) {
            if (indicatorCNWBuffers[i] === true) {
                buffers.push(clickDataSaver_3.clickDataSaver.clickLogData[i]);
            }
        }
        if (html_doc.SemanticClassifierCNWFlag.checked) {
            for (var i = 0; i < buffers.length; i++) {
                buffers[i] = semanticClassifier.alignToClassifier(buffers[i]);
            }
            rounding = 1;
        }
        NW.drawVerticalCNWLineDiagram(context, rounding, buffers);
    }
    function drawSemanticClassifier() {
        var context = html_doc.semanticClassifierCanvas.getContext("2d");
        context.clearRect(0, 0, html_doc.clickLogCanvas.width, html_doc.clickLogCanvas.height);
        if (html_doc.SemanticClassifierCheckBoxShow.checked) {
            semanticClassifier.drawSemanticFields(context, html_doc.clickLogCanvas.width / 2 - 12);
        }
    }
    function drawImage() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (redrawClickLog === true) {
                    redrawClickLog = false;
                    if (!(clickDataSaver_3.clickDataSaver.current === -1)) {
                        drawClickLog();
                    }
                    drawSemanticClassifier();
                }
                else if (drawSNW) {
                    drawSNW = false;
                    drawVerticalSNW();
                }
                else if (drawCNW) {
                    drawCNW = false;
                    drawVerticalCNW();
                }
                return [2];
            });
        });
    }
    function running() {
        return __awaiter(this, void 0, void 0, function () {
            var semanticValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (semanticClassifier_bottom != null && semanticClassifier_top != null) {
                            semanticValue = get_semantic_value();
                            semanticClassifier.setSemanticFields(semanticClassifier_top, semanticClassifier_bottom, semanticValue);
                            redrawClickLog = true;
                            semanticClassifier_bottom = null;
                            semanticClassifier_top = null;
                        }
                        if (!(shouldRenderNew === true)) return [3, 1];
                        html_doc.image.src = imageUrl;
                        shouldRenderNew = false;
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        imageUrl = clickDataSaver_3.clickDataSaver.imageWithDataOfClickLog;
                        html_doc.imageDataAnalysisInput.value = imageUrl;
                        Utils.set_data_for_scrollbar(html_doc.clickLogDataSetBar, String(0), String(0), String(0));
                        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(0), String(0));
                        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
                        return [4, running()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    }
    setup();
});
//# sourceMappingURL=index.js.map