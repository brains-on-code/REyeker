import {Coordinate} from "./Coordinate";
import {Rectangle} from "./Rectangle";
import {Helpers} from "./Helpers";

/**
 * enum for deblurring the image
 */
enum DISTANCE_CASE {
    IN_MIN = 1,
    INTERPOLATION,
}

/**
 * the image calculaotr class for blurring the image and deblurring it on need
 */
export class ImageCalculator {
    //saving the image
    private readonly bytesPerPixel: number = 4;
    private max_width: number;
    private max_height: number;

    //buffers for calculating
    private color_buffer: number[];
    private blurry_buffer: number[];
    private visible_buffer: number[];
    private has_calculated_lock: boolean;

    //for using a rectanlge to deblurr
    private use_rectangle: boolean;
    private minimal_width_visibility: number;
    private minimal_height_visibility: number;

    //for using a circle to deblurr
    private use_circle: boolean;
    private circle_radius: number;

    //for using a ellipse: number
    private use_ellipse: boolean;
    private ellipse_x_radius: number;
    private ellipse_y_radius: number;


    //for a deblurring radius
    private gradient_radius: number;

    //for using circle deblurr

    //for saving the newest render area
    private current_render_area: Rectangle;

    //for saving the click log data;
    private click_log: Coordinate[];
    private click_log_times : number[];
    private time_start: number;


    constructor() {
        this.color_buffer = [];
        this.blurry_buffer = [];
        this.visible_buffer = [];
        this.has_calculated_lock = false;
        this.max_width = 0;
        this.max_height = 0;

        this.use_rectangle = true;
        this.minimal_width_visibility = 200;
        this.minimal_height_visibility = 1;

        this.use_circle = false;
        this.circle_radius = 3;

        this.use_ellipse = true;
        this.ellipse_x_radius = 150;
        this.ellipse_y_radius = 20;

        this.gradient_radius = 30;

        this.current_render_area = new Rectangle(0, 0, 0, 0);

        this.click_log = [];
        this.click_log_times = [];
        this.time_start = 0;
    }

    /**
     * calculates the index bases on the given width and height
     *
     * @param width_idx     the x idx of the current image
     * @param height_idx    the y index of the current image
     */
    private to_index(width_idx: number, height_idx: number): number {
        return height_idx * this.max_width + width_idx;
    }

    /**
     * returns a "bounding line" in which the deblurring should be done
     *
     * @param current_coordinate    the coordinate as index from where to start
     * @param min_radius            the min radius where deblurring should happen
     * @param max_value             the values which shouldn't be crossed as max value
     * @private
     */
    private get_render_region(current_coordinate: number, min_radius: number, max_value: number): [number, number] {
        const min: number = Math.max(0, (current_coordinate - min_radius - this.gradient_radius));
        const max: number = Math.min(max_value, (current_coordinate + min_radius + this.gradient_radius));
        return [min, max];
    }

    /**
     * interpolates a color of the deblurred image and the blurred image at a specific idx
     *
     * @param idx       the idc where to blur
     * @param alpha     the alpha value for the interpolation
     */
    private get_color_interpolation(idx: number, alpha: number): [number, number, number] {
        const r: number = alpha * this.color_buffer[idx * this.bytesPerPixel] + (1.0 - alpha) * this.blurry_buffer[idx * this.bytesPerPixel];
        const g: number = alpha * this.color_buffer[idx * this.bytesPerPixel + 1] + (1.0 - alpha) * this.blurry_buffer[idx * this.bytesPerPixel + 1];
        const b: number = alpha * this.color_buffer[idx * this.bytesPerPixel + 2] + (1.0 - alpha) * this.blurry_buffer[idx * this.bytesPerPixel + 2];
        return [r, g, b];
    }

    /**
     * sets the color buffer and the current area which is rendered
     *
     * @param buffer    the buffer to save for the deblurred buffer
     * @param width     the width of the image
     * @param height    the height of the image
     */
    set_color_buffer(buffer: number[], width: number, height: number): void {
        this.max_width = width;
        this.max_height = height;
        this.current_render_area = new Rectangle(0, 0, width, height);
        this.color_buffer = buffer;
    }


    /**
     * calculates the blurred image, this may take some time
     *
     * @param x_radius_blur     the x radius for blurring
     * @param y_radius_blur     the y radius for blurring
     */
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
        this.time_start = Math.floor(performance.now());
    }

    /**
     * calculates the visible area and saves it to an inner value
     *
     * @param x_coordinate      x where to start
     * @param y_coordinate      y where to start
     */
    calculate_visible_area(x_coordinate: number, y_coordinate: number) {
        x_coordinate = Math.floor(x_coordinate);
        y_coordinate = Math.floor(y_coordinate);

        let gradiant_buffer: number[] = [...this.blurry_buffer];

        let y_distance_flag: number;
        let x_distance_flag: number;

        let x_min, x_max: number;
        let y_min, y_max: number;

        if(this.use_rectangle) {
            [x_min, x_max] = this.get_render_region(x_coordinate, this.minimal_width_visibility, this.max_width);
            [y_min, y_max] = this.get_render_region(y_coordinate, this.minimal_height_visibility, this.max_height);
        }else if(this.use_circle){
            [x_min, x_max] = this.get_render_region(x_coordinate, this.circle_radius, this.max_width);
            [y_min, y_max] = this.get_render_region(y_coordinate, this.circle_radius, this.max_height);
        }else if(this.use_ellipse){
            [x_min, x_max] = this.get_render_region(x_coordinate, this.ellipse_x_radius, this.max_width);
            [y_min, y_max] = this.get_render_region(y_coordinate, this.ellipse_y_radius, this.max_height);
        }

        this.current_render_area = new Rectangle(x_min, y_min, x_max - x_min, y_max - y_min);
        this.click_log.push(new Coordinate(x_coordinate, y_coordinate));
        this.click_log_times.push(Math.floor(performance.now() - this.time_start));

        if (this.use_rectangle) {
            for (let height_iter: number = y_min; height_iter < y_max; height_iter++) {

                //check if in y min for rectangle
                y_distance_flag = DISTANCE_CASE.INTERPOLATION;
                let y_distance = Math.sqrt(Math.pow(y_coordinate - height_iter, 2));
                if (this.use_rectangle && y_distance < this.minimal_height_visibility) {
                    y_distance_flag = DISTANCE_CASE.IN_MIN;
                }

                for (let width_iter: number = x_min; width_iter < x_max; width_iter++) {

                    //check if in x min for rectangle
                    x_distance_flag = DISTANCE_CASE.INTERPOLATION;
                    let x_distance = Math.sqrt(Math.pow(x_coordinate - width_iter, 2));
                    if (x_distance < this.minimal_width_visibility) {
                        x_distance_flag = DISTANCE_CASE.IN_MIN;
                    }

                    let idx = this.to_index(width_iter, height_iter);

                    if (x_distance_flag == DISTANCE_CASE.IN_MIN && y_distance_flag == DISTANCE_CASE.IN_MIN) {
                        //use unblurred
                        gradiant_buffer[idx * this.bytesPerPixel] = this.color_buffer[idx * this.bytesPerPixel];
                        gradiant_buffer[idx * this.bytesPerPixel + 1] = this.color_buffer[idx * this.bytesPerPixel + 1];
                        gradiant_buffer[idx * this.bytesPerPixel + 2] = this.color_buffer[idx * this.bytesPerPixel + 2];

                    } else {
                        //use interpolation
                        let x_distance_normalized: number = Math.max(0, x_distance - this.minimal_width_visibility);
                        x_distance_normalized = Math.max(0, x_distance_normalized / this.gradient_radius);

                        let y_distance_normalized: number = Math.max(0, y_distance - this.minimal_height_visibility);
                        y_distance_normalized = Math.max(0, y_distance_normalized / this.gradient_radius);

                        const distance: number = Math.min(1, x_distance_normalized + y_distance_normalized);
                        const alpha: number = 1.0 - distance;

                        const [r, g, b]: [number, number, number] = this.get_color_interpolation(idx, alpha);
                        gradiant_buffer[idx * this.bytesPerPixel] = r;
                        gradiant_buffer[idx * this.bytesPerPixel + 1] = g;
                        gradiant_buffer[idx * this.bytesPerPixel + 2] = b;
                    }
                }
            }
        }else if(this.use_circle){
            let rad_square = Math.pow(this.circle_radius,2);
            let rad_grad_square = Math.pow(this.circle_radius + this.gradient_radius, 2)

            for (let height_iter: number = y_min; height_iter < y_max; height_iter++) {
                for (let width_iter: number = x_min; width_iter < x_max; width_iter++) {

                    let clear = Math.pow(width_iter-x_coordinate,2) + Math.pow(height_iter-y_coordinate,2) <= rad_square;
                    let inter_value = Math.pow(width_iter-x_coordinate,2) + Math.pow(height_iter-y_coordinate,2);
                    let interpolate = inter_value <= rad_grad_square;

                    let idx = this.to_index(width_iter, height_iter);

                    if (clear) {
                        //use unblurred
                        gradiant_buffer[idx * this.bytesPerPixel] = this.color_buffer[idx * this.bytesPerPixel];
                        gradiant_buffer[idx * this.bytesPerPixel + 1] = this.color_buffer[idx * this.bytesPerPixel + 1];
                        gradiant_buffer[idx * this.bytesPerPixel + 2] = this.color_buffer[idx * this.bytesPerPixel + 2];
                    } else if(interpolate){
                        //use interpolation
                        let x_distance = Math.abs(x_coordinate-width_iter);
                        let y_distance = Math.abs(y_coordinate-height_iter);

                        let x_distance_normalized: number = Math.max(0, x_distance - this.circle_radius);
                        x_distance_normalized = Math.max(0, x_distance_normalized / this.gradient_radius);

                        let y_distance_normalized: number = Math.max(0, y_distance - this.circle_radius);
                        y_distance_normalized = Math.max(0, y_distance_normalized / this.gradient_radius);

                        const distance: number = Math.min(1, Math.sqrt(Math.pow(x_distance_normalized,2)+ Math.pow(y_distance_normalized,2)));
                        let alpha = 1-Math.min(distance/this.gradient_radius, 1);


                        const [r, g, b]: [number, number, number] = this.get_color_interpolation(idx, alpha);
                        gradiant_buffer[idx * this.bytesPerPixel] = r;
                        gradiant_buffer[idx * this.bytesPerPixel + 1] = g;
                        gradiant_buffer[idx * this.bytesPerPixel + 2] = b;
                    }
                }
            }
        }else if(this.use_ellipse){
            let x_rad_square = Math.pow(this.ellipse_x_radius, 2);
            let y_rad_square = Math.pow(this.ellipse_y_radius, 2);

            let x_rad_grad_square = Math.pow(this.ellipse_x_radius +this.gradient_radius, 2);
            let y_rad_grad_square = Math.pow(this.ellipse_y_radius +this.gradient_radius, 2);

            for (let height_iter: number = y_min; height_iter < y_max; height_iter++) {
                for (let width_iter: number = x_min; width_iter < x_max; width_iter++) {

                    let clear = Math.pow(width_iter-x_coordinate,2)/x_rad_square + Math.pow(height_iter-y_coordinate,2)/y_rad_square <= 1;
                    let inter_value = Math.pow(width_iter-x_coordinate,2)/x_rad_grad_square + Math.pow(height_iter-y_coordinate,2)/y_rad_grad_square;
                    let interpolate = inter_value <= 1;

                    let idx = this.to_index(width_iter, height_iter);

                    if (clear) {
                        //use unblurred
                        gradiant_buffer[idx * this.bytesPerPixel] = this.color_buffer[idx * this.bytesPerPixel];
                        gradiant_buffer[idx * this.bytesPerPixel + 1] = this.color_buffer[idx * this.bytesPerPixel + 1];
                        gradiant_buffer[idx * this.bytesPerPixel + 2] = this.color_buffer[idx * this.bytesPerPixel + 2];
                    } else if(interpolate){
                        //use interpolation
                        let x_distance = Math.abs(x_coordinate-width_iter);
                        let y_distance = Math.abs(y_coordinate-height_iter);

                        let x_distance_normalized: number = Math.max(0, x_distance - this.ellipse_x_radius);
                        x_distance_normalized = Math.max(0, x_distance_normalized / this.gradient_radius);

                        let y_distance_normalized: number = Math.max(0, y_distance - this.ellipse_y_radius);
                        y_distance_normalized = Math.max(0, y_distance_normalized / this.gradient_radius);

                        const distance: number = Math.min(1, Math.sqrt(Math.pow(x_distance_normalized,2)+ Math.pow(y_distance_normalized,2)));
                        const alpha: number = 1.0 - distance;

                        const [r, g, b]: [number, number, number] = this.get_color_interpolation(idx, alpha);
                        gradiant_buffer[idx * this.bytesPerPixel] = r;
                        gradiant_buffer[idx * this.bytesPerPixel + 1] = g;
                        gradiant_buffer[idx * this.bytesPerPixel + 2] = b;
                    }
                }
            }
        }
        this.visible_buffer = gradiant_buffer;
    }


    /**
     * clears the whole click log to an empty array
     */
    clear_click_log() {
        this.click_log = [];
    }

    /**
     * gets the click log
     */
    get_click_log(): Coordinate[] {
        return this.click_log;
    }

    /**
     *
     */
    get_click_log_times(): number[]{
        return this.click_log_times;
    }

    /**
     * set the click log
     */
    set_click_log(click_log: Coordinate[]) {
        this.click_log = click_log;
    }

    /**
     * sets the click log based on a string
     *
     * @param data_str
     */
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

    /**
     * returns the size of the click log
     */
    get_click_log_size(): number {
        return this.click_log.length;
    }

    /**
     * returns the newest renderer area which was updated
     */
    get_current_render_area(): Rectangle {
        return this.current_render_area;
    }

    /**
     * returns the deblurred buffer
     */
    get_visible_buffer(): number[] {
        return this.visible_buffer;
    }

    /**
     * returns the blurred buffer
     */
    get_blurry_buffer(): number[] {
        return this.blurry_buffer;
    }

    /**
     * returns the unblurred buffer
     */
    get_color_buffer(): number[]{
        return this.color_buffer;
    }

    /**
     * checks if the image was blurred and resets the flag
     */
    read_and_reset_calculated_lock(){
        let tmp = this.has_calculated_lock;
        this.has_calculated_lock = false;
        return tmp;
    }

    ///-----------------------------------------------RECTANGLE---------------------------------------------------------

    /**
     * use rectangle for deblurring
     */
    set_use_rectangle(){
        this.use_rectangle = true;
        this.use_circle = false;
        this.use_ellipse = false;
    }

    /**
     * sets the minimal width visiblity
     *
     * @param minimal_width_radius
     */
    set_minimal_width_radius(minimal_width_radius: number) {
        this.minimal_width_visibility = minimal_width_radius;
    }

    /**
     * gets the minimal width visiblity
     */
    get_minimal_width_radius(): number {
        return this.minimal_width_visibility;
    }

    /**
     * sets the minimal height visiblity
     *
     * @param minimal_height_radius
     */
    set_minimal_height_radius(minimal_height_radius: number) {
        this.minimal_height_visibility = minimal_height_radius;
    }

    /**
     * gets the minimal height visiblity
     */
    get_minimal_height_radius() {
        return this.minimal_height_visibility;
    }

    /**
     * set the radius of the gradient
     *
     * @param gradient_radius
     */
    set_gradient_radius(gradient_radius: number) {
        this.gradient_radius = gradient_radius;
    }

    /**
     * get the radius of the gradient
     */
    get_gradient_radius(): number {
        return this.gradient_radius;
    }

    ///----------------------------------------------Circle-------------------------------------------------------------

    /**
     * use circle for deblurring
     */
    set_use_circle(){
        this.use_rectangle = false;
        this.use_circle = true;
        this.use_ellipse = false;
    }

    /**
     * sets the radius of the circle
     *
     * @param radius
     */
    set_circle_radius(radius: number){
        this.circle_radius = radius;
    }


    /**
     * return the radius of the circle
     */
    get_circle_radius() : number{
        return this.circle_radius
    }

    ///-----------------------------------------------Ellipse-----------------------------------------------------------

    /**
     * use ellipse for deblurring
     */
    set_use_ellipse(){
        this.use_rectangle = false;
        this.use_circle = false;
        this.use_ellipse = true;
    }

    /**
     * set the x radius for the ellipse
     *
     * @param radius_x
     */
    set_ellipse_radius_x(radius_x: number){
        this.ellipse_x_radius = radius_x;
    }


    /**
     * set the y radius for the ellipse
     *
     * @param radius_y
     */
    set_ellipse_radius_y(radius_y: number){
        this.ellipse_y_radius = radius_y;
    }


    /**
     * return the x radius of the ellipse
     */
    get_ellipse_radius_x() : number{
        return this.ellipse_x_radius;
    }


    /**
     * return the y radius of the ellipse
     */
    get_ellipse_radius_y() : number{
        return this.ellipse_y_radius;
    }

}