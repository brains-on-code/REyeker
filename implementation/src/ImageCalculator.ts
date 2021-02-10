import {Coordinate} from "./Coordinate";
import {Rectangle} from "./Rectangle";
import {Helpers} from "./Helpers";

enum DISTANCE_CASE {
    IN_MIN = 1,
    INTERPOLATION,
}

export class ImageCalculator {
    private readonly bytesPerPixel: number = 4;
    private color_buffer: number[];
    private blurry_buffer: number[];
    private visible_buffer: number[];
    private max_width: number;
    private max_height: number;
    private minimal_width_visibility: number;
    private minimal_height_visibility: number;
    private gradient_radius: number;
    private gradient_x_ratio: number;
    private gradient_y_ratio: number;
    private current_render_area: Rectangle;
    private click_log: Coordinate[];
    private has_calculated_lock: boolean;

    constructor() {
        this.color_buffer = [];
        this.blurry_buffer = [];
        this.visible_buffer = [];
        this.max_width = 0;
        this.max_height = 0;
        this.minimal_width_visibility = 5;
        this.minimal_height_visibility = 5;
        this.gradient_radius = 10;
        this.gradient_x_ratio = 1.0;
        this.gradient_y_ratio = 5;
        this.current_render_area = new Rectangle(0, 0, 0, 0);
        this.has_calculated_lock = false;
        this.click_log = [];
    }

    private to_index(width_idx: number, height_idx: number): number {
        return height_idx * this.max_width + width_idx;
    }

    private get_render_region(current_coordinate: number, min_radius: number, factor: number, max_value: number): [number, number] {
        const min: number = Math.max(0, (current_coordinate - min_radius - (1.5 / factor * this.gradient_radius)));
        const max: number = Math.min(max_value, (current_coordinate + min_radius + (1.5 / factor * this.gradient_radius)));
        return [min, max];
    }

    private get_color_interpolation(idx: number, alpha: number): [number, number, number] {
        const r: number = alpha * this.color_buffer[idx * this.bytesPerPixel] + (1.0 - alpha) * this.blurry_buffer[idx * this.bytesPerPixel];
        const g: number = alpha * this.color_buffer[idx * this.bytesPerPixel + 1] + (1.0 - alpha) * this.blurry_buffer[idx * this.bytesPerPixel + 1];
        const b: number = alpha * this.color_buffer[idx * this.bytesPerPixel + 2] + (1.0 - alpha) * this.blurry_buffer[idx * this.bytesPerPixel + 2];
        return [r, g, b];
    }

    set_color_buffer(buffer: number[], width: number, height: number): void {
        this.max_width = width;
        this.max_height = height;
        this.current_render_area = new Rectangle(0, 0, width, height);
        this.color_buffer = buffer;
    }


    calculate_blurred(x_radius_blur: number, y_radius_blur): void {
        this.current_render_area = new Rectangle(0, 0, 0, 0);

        let horizontal_buffer: number[] = Helpers.array_of_size(this.color_buffer.length);

        for (let height_iter = 0; height_iter < this.max_height; height_iter++) {

            const height_idx = height_iter * this.max_width * this.bytesPerPixel;

            horizontal_buffer[height_idx] = this.color_buffer[height_idx];
            horizontal_buffer[height_idx + 1] = this.color_buffer[height_idx + 1];
            horizontal_buffer[height_idx + 2] = this.color_buffer[height_idx + 2];

            for (let width_iter = 1; width_iter < this.max_width; width_iter++) {
                const width_idx = width_iter * this.bytesPerPixel;
                const width_idx_m = (width_iter - 1) * this.bytesPerPixel;

                horizontal_buffer[height_idx + width_idx] = horizontal_buffer[height_idx + width_idx_m] + this.color_buffer[height_idx + width_idx];
                horizontal_buffer[height_idx + width_idx + 1] = horizontal_buffer[height_idx + width_idx_m + 1] + this.color_buffer[height_idx + width_idx + 1];
                horizontal_buffer[height_idx + width_idx + 2] = horizontal_buffer[height_idx + width_idx_m + 2] + this.color_buffer[height_idx + width_idx + 2];

            }
        }


        let sum_buf: number[] = Helpers.array_of_size(this.color_buffer.length);

        for (let width_iter = 0; width_iter < this.max_width; width_iter++) {
            sum_buf[width_iter * this.bytesPerPixel] = horizontal_buffer[width_iter * this.bytesPerPixel];
            sum_buf[width_iter * this.bytesPerPixel + 1] = horizontal_buffer[width_iter * this.bytesPerPixel + 1];
            sum_buf[width_iter * this.bytesPerPixel + 2] = horizontal_buffer[width_iter * this.bytesPerPixel + 2];
        }

        for (let height_iter = 1; height_iter < this.max_height; height_iter++) {
            let height_idx = height_iter * this.max_width * this.bytesPerPixel;
            let height_idx_m = (height_iter - 1) * this.max_width * this.bytesPerPixel;

            sum_buf[height_idx] = horizontal_buffer[height_idx] + sum_buf[height_idx_m];
            sum_buf[height_idx + 1] = horizontal_buffer[height_idx + 1] + sum_buf[height_idx_m + 1];
            sum_buf[height_idx + 2] = horizontal_buffer[height_idx + 2] + sum_buf[height_idx_m + 2];

            for (let width_iter = 1; width_iter < this.max_width; width_iter++) {

                let width_idx = width_iter * this.bytesPerPixel;

                sum_buf[height_idx + width_idx] = sum_buf[height_idx_m + width_idx] + horizontal_buffer[height_idx + width_idx];
                sum_buf[height_idx + width_idx + 1] = sum_buf[height_idx_m + width_idx + 1] + horizontal_buffer[height_idx + width_idx + 1];
                sum_buf[height_idx + width_idx + 2] = sum_buf[height_idx_m + width_idx + 2] + horizontal_buffer[height_idx + width_idx + 2];
            }
        }


        let blur_buf = Helpers.array_of_size(this.color_buffer.length);

        for (let height_iter = 0; height_iter < this.max_height; height_iter++) {

            let current_height = height_iter * this.max_width * this.bytesPerPixel;

            let height_minus_y_idx = Math.max(0, height_iter - y_radius_blur);
            let height_plus_y_idx = Math.min((this.max_height - 1), (height_iter + y_radius_blur));

            let height_minus_y = height_minus_y_idx * this.max_width * this.bytesPerPixel;
            let height_plus_y = height_plus_y_idx * this.max_width * this.bytesPerPixel;

            for (let width_iter = 0; width_iter < this.max_width; width_iter++) {

                let current_width = width_iter * this.bytesPerPixel;

                let width_minus_x_idx = Math.max(0, (width_iter - x_radius_blur));
                let width_plus_x_idx = Math.min((this.max_width - 1), (width_iter + x_radius_blur));

                let width_minus_x = width_minus_x_idx * this.bytesPerPixel;
                let width_plus_x = width_plus_x_idx * this.bytesPerPixel;

                let p_x_p_y = (width_plus_x + height_plus_y);
                let n_x_n_y = (width_minus_x + height_minus_y);
                let n_x_p_y = (width_minus_x + height_plus_y);
                let p_x_n_y = (width_plus_x + height_minus_y);

                let norm = 1. / ((width_plus_x_idx - width_minus_x_idx) * (height_plus_y_idx - height_minus_y_idx));
                blur_buf[current_height + current_width] = norm * (sum_buf[p_x_p_y] + sum_buf[n_x_n_y] - sum_buf[n_x_p_y] - sum_buf[p_x_n_y]);
                blur_buf[current_height + current_width + 1] = norm * (sum_buf[p_x_p_y + 1] + sum_buf[n_x_n_y + 1] - sum_buf[n_x_p_y + 1] - sum_buf[p_x_n_y + 1]);
                blur_buf[current_height + current_width + 2] = norm * (sum_buf[p_x_p_y + 2] + sum_buf[n_x_n_y + 2] - sum_buf[n_x_p_y + 2] - sum_buf[p_x_n_y + 2]);

            }
        }


        this.blurry_buffer = blur_buf;
        this.has_calculated_lock = true;
    }

    calculate_visible_area(x_coordinate: number, y_coordinate: number) {
        x_coordinate = Math.floor(x_coordinate);
        y_coordinate = Math.floor(y_coordinate);

        let gradiant_buffer: number[] = [...this.blurry_buffer];

        let y_distance_flag: number;
        let x_distance_flag: number;

        const [x_min, x_max]: [number, number] = this.get_render_region(x_coordinate, this.minimal_width_visibility, this.gradient_x_ratio, this.max_width);
        const [y_min, y_max]: [number, number] = this.get_render_region(y_coordinate, this.minimal_height_visibility, this.gradient_y_ratio, this.max_height);

        this.current_render_area = new Rectangle(x_min, y_min, x_max - x_min, y_max - y_min);
        this.click_log.push(new Coordinate(x_coordinate, y_coordinate));

        for (let height_iter: number = y_min; height_iter < y_max; height_iter++) {
            y_distance_flag = DISTANCE_CASE.INTERPOLATION;

            let y_distance = Math.sqrt(Math.pow(y_coordinate - height_iter, 2));
            if (y_distance < this.minimal_height_visibility) {
                y_distance_flag = DISTANCE_CASE.IN_MIN;
            }

            for (let width_iter: number = x_min; width_iter < x_max; width_iter++) {
                x_distance_flag = DISTANCE_CASE.INTERPOLATION;
                let x_distance = Math.sqrt(Math.pow(x_coordinate - width_iter, 2));
                if (x_distance < this.minimal_width_visibility) {
                    x_distance_flag = DISTANCE_CASE.IN_MIN;
                }

                let idx = this.to_index(width_iter, height_iter);
                if (x_distance_flag == DISTANCE_CASE.IN_MIN && y_distance_flag == DISTANCE_CASE.IN_MIN) {
                    gradiant_buffer[idx * this.bytesPerPixel] = this.color_buffer[idx * this.bytesPerPixel];
                    gradiant_buffer[idx * this.bytesPerPixel + 1] = this.color_buffer[idx * this.bytesPerPixel + 1];
                    gradiant_buffer[idx * this.bytesPerPixel + 2] = this.color_buffer[idx * this.bytesPerPixel + 2];
                } else {
                    let x_distance_normalized: number = Math.max(0, x_distance - this.minimal_width_visibility);
                    x_distance_normalized = Math.max(0, x_distance_normalized / this.gradient_radius);

                    let y_distance_normalized: number = Math.max(0, y_distance - this.minimal_height_visibility);
                    y_distance_normalized = Math.max(0, y_distance_normalized / this.gradient_radius);

                    const distance: number = Math.min(1, (this.gradient_x_ratio * x_distance_normalized + this.gradient_y_ratio * y_distance_normalized) / (this.gradient_x_ratio + this.gradient_y_ratio));
                    const alpha: number = 1.0 - distance;

                    const [r, g, b]: [number, number, number] = this.get_color_interpolation(idx, alpha);
                    gradiant_buffer[idx * this.bytesPerPixel] = r;
                    gradiant_buffer[idx * this.bytesPerPixel + 1] = g;
                    gradiant_buffer[idx * this.bytesPerPixel + 2] = b;
                }
            }

        }
        this.visible_buffer = gradiant_buffer;
    }

    get_click_log(): Coordinate[] {
        return this.click_log;
    }

    set_click_log(click_log: Coordinate[]) {
        this.click_log = click_log;
    }

    set_click_log_from_string(data_str: string) {
        let coordinates_pair_tuples_String: string[] = data_str.split(" ");
        let click_log_vector: Coordinate[] = [];
        for (let i = 0; i < coordinates_pair_tuples_String.length; i++) {
            let coord_string: string[] = coordinates_pair_tuples_String[i].split("-");
            let coord: Coordinate = new Coordinate(Number(coord_string[0]), Number(coord_string[1]));
            click_log_vector.push(coord);
        }
        this.set_click_log(click_log_vector);
    }

    get_click_log_size(): number {
        return this.click_log.length;
    }

    get_current_render_area(): Rectangle {
        return this.current_render_area;
    }

    get_visible_buffer(): number[] {
        return this.visible_buffer;
    }

    get_blurry_buffer(): number[] {
        return this.blurry_buffer;
    }

    get_color_buffer(): number[]{
        return this.color_buffer;
    }

    set_minimal_width_radius(minimal_width_radius: number) {
        this.minimal_width_visibility = minimal_width_radius;
    }

    get_minimal_width_radius(): number {
        return this.minimal_width_visibility;
    }

    set_minimal_height_radius(minimal_height_radius: number) {
        this.minimal_height_visibility = minimal_height_radius;
    }

    get_minimal_height_radius() {
        return this.minimal_height_visibility;
    }

    set_gradient_radius(gradient_radius: number) {
        this.gradient_radius = gradient_radius;
    }

    get_gradient_radius(): number {
        return this.gradient_radius;
    }

    set_gradient_x_ratio(gradient_x_radius: number) {
        this.gradient_x_ratio = Math.min(1.0, Math.max(0.0, gradient_x_radius));
    }

    set_gradient_y_ratio(gradient_y_radius: number) {
        this.gradient_y_ratio = Math.min(1.0, Math.max(0.0, gradient_y_radius));
    }

    clear_click_log() {
        this.click_log = [];
    }

    read_and_reset_calculated_lock(){
        let tmp = this.has_calculated_lock;
        this.has_calculated_lock = false;
        return tmp;
    }
}