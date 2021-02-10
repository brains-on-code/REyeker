declare module "Coordinate" {
    export class Coordinate {
        private readonly x;
        private readonly y;
        constructor(x: number, y: number);
        get_x(): number;
        get_y(): number;
    }
}
declare module "Helpers" {
    export class Helpers {
        static array_of_size(size: number): number[];
    }
}
declare module "Rectangle" {
    import { Coordinate } from "Coordinate";
    export class Rectangle {
        private readonly start;
        private readonly x_range;
        private readonly y_range;
        constructor(x_start: number, y_start: number, x_range: number, y_range: number);
        get_start(): Coordinate;
        get_x_range(): number;
        get_y_range(): number;
    }
}
declare module "ImageCalculator" {
    import { Coordinate } from "Coordinate";
    import { Rectangle } from "Rectangle";
    export class ImageCalculator {
        private readonly bytesPerPixel;
        private color_buffer;
        private blurry_buffer;
        private visible_buffer;
        private max_width;
        private max_height;
        private minimal_width_visibility;
        private minimal_height_visibility;
        private gradient_radius;
        private gradient_x_ratio;
        private gradient_y_ratio;
        private current_render_area;
        private click_log;
        private has_calculated_lock;
        constructor();
        private to_index;
        private get_render_region;
        private get_color_interpolation;
        set_color_buffer(buffer: number[], width: number, height: number): void;
        calculate_blurred(x_radius_blur: number, y_radius_blur: any): void;
        calculate_visible_area(x_coordinate: number, y_coordinate: number): void;
        get_click_log(): Coordinate[];
        set_click_log(click_log: Coordinate[]): void;
        set_click_log_from_string(data_str: string): void;
        get_click_log_size(): number;
        get_current_render_area(): Rectangle;
        get_visible_buffer(): number[];
        get_blurry_buffer(): number[];
        get_color_buffer(): number[];
        set_minimal_width_radius(minimal_width_radius: number): void;
        get_minimal_width_radius(): number;
        set_minimal_height_radius(minimal_height_radius: number): void;
        get_minimal_height_radius(): number;
        set_gradient_radius(gradient_radius: number): void;
        get_gradient_radius(): number;
        set_gradient_x_ratio(gradient_x_radius: number): void;
        set_gradient_y_ratio(gradient_y_radius: number): void;
        clear_click_log(): void;
        read_and_reset_calculated_lock(): boolean;
    }
}
declare module "useCases" {
    export class UseCases {
        static htmlTesting: boolean;
        static soSciSurvey: boolean;
        static isValid(): boolean;
    }
}
declare module "rEYEker" { }
