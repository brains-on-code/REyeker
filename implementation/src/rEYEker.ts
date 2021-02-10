import {UseCases} from "./useCases"
import {ImageCalculator} from "./ImageCalculator";
import {Rectangle} from "./Rectangle";

/**
 * A Section for global variables
 */
let mouseXOverMainCanvas: number; //the x coordinate over the canvas, used for drawing
let mouseYOverMainCanvas: number; //the y coordinate over the canvas, used for drawing
let shouldRenderNew: boolean = true; //a boolean value, used to indicate if the canvas should be re rendered
let mouseMoved: boolean = true; //a boolean value, used to indicate if the mouse was moved
let mouseClickedLeft: boolean = false; //a boolean value, used to indicate if the mouse was clicked
let mouseClickMode: boolean = true; //a boolean value, used to indicate if in mouse click or hover mode to deblur
let calculateNew: boolean = true; //a boolean value, used to indicate if the blur should be recalculated
let ex_1_url: string = "./images/Student.PNG"; //the used test image, use an rgb (8 bit color depth) image
let ex_2_url: string = "./images/Calculation.PNG"; //the used test image, use an rgb (8 bit color depth) im./imagesge
let ex_3_url: string = "./images/Rectangle.PNG"; //the used test image, use an rgb (8 bit color depth) image

let imageUrl: string; //the img which will be loaded
let variableName: string;//the name for the intern soSci variable name
let x_blur_radius = 8;
let y_blur_radius = 8;
let grad_radius = 30;
let minimal_width = 200;
let minimal_height = 1;
let x_ratio = 1;
let y_ratio = 1;
/**
 * A Section for used html references
 */
let visibleImageCanvas: HTMLCanvasElement;//canvas for drawing the visible Part
let clickLogCanvas: HTMLCanvasElement;//canvas for drawing the clickLog used for speeding up;
let xFoldingRangeInput: HTMLInputElement; //a scrollbar for x blur inpout
let yFoldingRangeInput: HTMLInputElement; //a scrollbar for y blur input
let minimalXVisibilityInput: HTMLInputElement; //a scrollbar for minimal x visibility
let minimalYVisibilityInput: HTMLInputElement; //a scrollbar for minimal y visibility
let blurRadiusInput: HTMLInputElement; //a scrollbar for generell blur radius input
let blurXRatioInput: HTMLInputElement; //a scrollbar for the x ratio input
let blurYRatioInput: HTMLInputElement; //a scrollbar for the y ratio input
let mouseClickActivationInput: HTMLInputElement; //a checkbox indicating if it should deblur on mouse click or hover
let ex_1_box: HTMLInputElement; //the url of example 1 in html testing
let ex_2_box: HTMLInputElement; //the url of example 2 in html testing
let ex_3_box: HTMLInputElement; //the url of example 3 in html testing


if (UseCases.htmlTesting === true) {
    xFoldingRangeInput = <HTMLInputElement>document.getElementById("xFoldingRange");
    yFoldingRangeInput = <HTMLInputElement>document.getElementById("yFoldingRange");
    minimalXVisibilityInput = <HTMLInputElement>document.getElementById("minimalXVisibility");
    minimalYVisibilityInput = <HTMLInputElement>document.getElementById("minimalYVisibility");
    blurRadiusInput = <HTMLInputElement>document.getElementById("blurRadius");
    blurXRatioInput = <HTMLInputElement>document.getElementById("blurXRatio");
    blurYRatioInput = <HTMLInputElement>document.getElementById("blurYRatio");
    mouseClickActivationInput = <HTMLInputElement>document.getElementById("mouseClickActivation");
    ex_1_box = <HTMLInputElement>document.getElementById("ex_1");
    ex_2_box = <HTMLInputElement>document.getElementById("ex_2");
    ex_3_box = <HTMLInputElement>document.getElementById("ex_3");
    visibleImageCanvas = <HTMLCanvasElement>document.getElementById("visible-image-canvas");
    clickLogCanvas = <HTMLCanvasElement>document.getElementById("click-log-canvas");
}
if (UseCases.soSciSurvey === true) {
    imageUrl = document.getElementById("imageToBlurTag").innerHTML; //the used test image, use an rgba (8 bit color depth) image
    variableName = document.getElementById("clickLogVariable").innerHTML; //the name of the inner variable of soSci
    visibleImageCanvas = <HTMLCanvasElement>document.getElementById("visible-image-canvas");
}

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("bubble-image-canvas");
let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

let image: HTMLImageElement = new Image();
let eyeTrackImage: ImageCalculator;

/**
 * a function to forward the x and y coordinates if the mouse is moved
 */
visibleImageCanvas.addEventListener('mousemove', function (event: MouseEvent) {
    const rect = visibleImageCanvas.getBoundingClientRect();
    mouseXOverMainCanvas = event.x - rect.left;
    mouseYOverMainCanvas = event.y - rect.top;
    mouseMoved = true;
})


/**
 * a function to log that the mouse was clicked (left mouse button)
 */
visibleImageCanvas.addEventListener('mousedown', function (event: MouseEvent) {
    if (event.button === 0) {
        const rect = visibleImageCanvas.getBoundingClientRect();
        mouseXOverMainCanvas = event.x - rect.left;
        mouseYOverMainCanvas = event.y - rect.top;
        mouseClickedLeft = true;
    }
})


/**
 * this condition is executed if html testing is enabled, it sets eventlisteners to certain required html elements
 */
if (UseCases.htmlTesting === true) {
    /**
     * a function to handle a change in x folding input
     */
    xFoldingRangeInput.oninput = function () {
        const xBlur = Number(xFoldingRangeInput.value);
        const yBlur = Number(yFoldingRangeInput.value);
        eyeTrackImage.calculate_blurred(xBlur, yBlur);
        shouldRenderNew = true;
        document.getElementById("xFoldingRangeLabel").innerText = "[" + xBlur + "]";
    };

    /**
     * a function to handle a change in y folding input
     */
    yFoldingRangeInput.oninput = function () {
        const xBlur = Number(xFoldingRangeInput.value);
        const yBlur = Number(yFoldingRangeInput.value);
        eyeTrackImage.calculate_blurred(xBlur, yBlur);
        shouldRenderNew = true;
        document.getElementById("yFoldingRangeLabel").innerText = "[" + yBlur + "]";
    };

    /**
     * a function to handle a change in minimal x visibility input
     */
    minimalXVisibilityInput.oninput = function () {
        const minimalXVisibility = Number(minimalXVisibilityInput.value);
        eyeTrackImage.set_minimal_width_radius(minimalXVisibility);
        document.getElementById("minimalXVisibilityLabel").innerText = "[" + minimalXVisibility + "]";
    };

    /**
     * a function to handle a change in minimal y visibility input
     */
    minimalYVisibilityInput.oninput = function () {
        const minimalYVisibility = Number(minimalYVisibilityInput.value);
        eyeTrackImage.set_minimal_height_radius(minimalYVisibility);
        document.getElementById("minimalYVisibilityLabel").innerText = "[" + minimalYVisibility + "]";
    };

    /**
     * a function to handle a change in blur radius input
     */
    blurRadiusInput.oninput = function () {
        const blurRadius = Number(blurRadiusInput.value);
        eyeTrackImage.set_gradient_radius(blurRadius);
        document.getElementById("blurRadiusLabel").innerText = "[" + blurRadius + "]";
    };

    /**
     * a function to handle a change x ratio input (input will be normed to [0,1])
     */
    blurXRatioInput.oninput = function () {
        const blurXRatio = Number(blurXRatioInput.value);
        eyeTrackImage.set_gradient_x_ratio(blurXRatio / 100);
        document.getElementById("blurXRatioLabel").innerText = "[" + blurXRatio + "]%";
    };

    /**
     * a function to handle a change y ratio input (input will be normed to [0,1])
     */
    blurYRatioInput.oninput = function () {
        const blurYRatio = Number(blurYRatioInput.value);
        eyeTrackImage.set_gradient_y_ratio(blurYRatio / 100);
        document.getElementById("blurYRatioLabel").innerText = "[" + blurYRatio + "]%";
    };

    /**
     * a function which sets a flag, indicating if we are in mouse hover or click mode based on the checkbox.
     */
    mouseClickActivationInput.onchange = function () {
        mouseClickMode = mouseClickActivationInput.checked;
    };

    /**
     * a function to handle example selection for example 1-3
     */
    ex_1_box.onchange = function () {
        if (ex_1_box.checked === true) {
            imageUrl = ex_1_url;
            ex_2_box.checked = false;
            ex_3_box.checked = false;
            calculateNew = true;
            eyeTrackImage.clear_click_log();
        }
    };

    /**
     * a function to handle example selection for example 1-3
     */
    ex_2_box.onchange = function () {
        if (ex_2_box.checked === true) {
            imageUrl = ex_2_url;
            ex_1_box.checked = false;
            ex_3_box.checked = false;
            calculateNew = true;
            eyeTrackImage.clear_click_log();
        }
    };

    /**
     * a function to handle example selection for example 1-3
     */
    ex_3_box.onchange = function () {
        if (ex_3_box.checked === true) {
            imageUrl = ex_3_url;
            ex_1_box.checked = false;
            ex_2_box.checked = false;
            calculateNew = true;
            eyeTrackImage.clear_click_log();
        }
    };
}

/**
 * this function will be called if a new src is set to image.
 * It will set up the canvas and calculate the blurry buffer for the buuble view.
 * All values for the set up, will be getted from the html inputs.
 */
image.onload = async function () {

    debugger
    canvas.width = image.width;
    canvas.height = image.height;

    visibleImageCanvas.width = image.width;
    visibleImageCanvas.height = image.height;

    let buffer_canvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas");
    buffer_canvas.width = image.width;
    buffer_canvas.height = image.height;

    let buffer_ctx: CanvasRenderingContext2D = buffer_canvas.getContext("2d");


    await buffer_ctx.drawImage(image, 0, 0, image.width, image.height);

    let colorBuffer: ImageData = buffer_ctx.getImageData(0, 0, image.width, image.height);
    let colorBufferData: Uint8Array = Uint8Array.from(colorBuffer.data);

    await buffer_canvas.remove();

    let data: number[] = [].slice.call(colorBufferData);
    let width: number = image.width;
    let height: number = image.height;

    eyeTrackImage.set_color_buffer(data, width, height);

    await eyeTrackImage.calculate_blurred(x_blur_radius, y_blur_radius);

    eyeTrackImage.set_gradient_radius(grad_radius);
    eyeTrackImage.set_minimal_width_radius(minimal_width);
    eyeTrackImage.set_minimal_height_radius(minimal_height);
    eyeTrackImage.set_gradient_x_ratio(x_ratio);
    eyeTrackImage.set_gradient_y_ratio(y_ratio);

    calculateNew = false;
};

/**
 * This function draw a sub rectangle on the canvas based in the array buffer
 *
 * @param y_start       the y coordinate where the sub rectangle starts
 * @param y_end         the y coordinate where the sub rectangle ends
 * @param x_start       the x coordinate where the sub rectangle starts
 * @param x_end         the x coordinate where the sub rectangle ends
 * @param arrayBuffer   the buffer, which will be used for drawing, should be rgba
 * @param width         the width of the canvas, used for calculating the following rows
 * @param context
 */
async function drawSubPart(y_start: number, y_end: number, x_start: number, x_end, arrayBuffer: number[], width: number, context: CanvasRenderingContext2D) {
    for (let y = y_start; y < y_end; y++) {
        let pos_y = y * width;
        for (let x = x_start; x < x_end; x++) {
            let pos = pos_y + x;
            let idx = pos * 4;
            context.fillStyle = 'rgb(' + Math.floor(arrayBuffer[idx]) + ',' + Math.floor(arrayBuffer[idx + 1]) + ',' + Math.floor(arrayBuffer[idx + 2]) + ')';
            context.fillRect(x, y, 1, 1);
        }
    }
}


/**
 * draws the blurry buffer with the visible parts of the last input
 */
async function drawBlurryBuffer() {
    while (eyeTrackImage.read_and_reset_calculated_lock() == false) {

    }

    const buffer: number[] = eyeTrackImage.get_blurry_buffer();

    await drawSubPart(0, image.height, 0, image.width, buffer, image.width, ctx);
}

/**
 * renders two parts of the image new, based on the history of events and clicks.
 * One is the new event and the other one is the overriding of the last event.
 *
 * @param arrayBuffer   the buffer which will be used as database for drawing
 * @param width         the maxium width to determine the rows
 * @param canvas        the canvas to draw on
 */
async function redrawRenderArea(arrayBuffer: number[], width: number, canvas: HTMLCanvasElement) {
    const ctx_tmp: CanvasRenderingContext2D = canvas.getContext("2d");

    ctx_tmp.clearRect(0, 0, canvas.width, canvas.height);
    const new_render: Rectangle = eyeTrackImage.get_current_render_area();

    const y_start: number = new_render.get_start().get_y();
    const y_end: number = new_render.get_start().get_y() + new_render.get_y_range();

    const x_start: number = new_render.get_start().get_x();
    const x_end: number = new_render.get_start().get_x() + new_render.get_x_range();


    await drawSubPart(y_start, y_end, x_start, x_end, arrayBuffer, width, ctx_tmp);
}

/**
 * draws the visible part of the last inpout
 */
async function drawVisiblePart() {
    eyeTrackImage.calculate_visible_area(mouseXOverMainCanvas, mouseYOverMainCanvas);
    const buffer: number[] = eyeTrackImage.get_visible_buffer();
    await redrawRenderArea(buffer, image.width, visibleImageCanvas);
}

/**
 * draws the Image based on the state of the Image
 * either:
 *  draws the hole image new
 *  draws the click log
 *  draws the blurry buffer with visible part
 */
async function drawImage() {
    if (shouldRenderNew === true) {
        shouldRenderNew = false;

        await drawBlurryBuffer();
    } else {
        if (mouseClickMode === false && mouseMoved === true) {
            mouseMoved = false;
            await drawVisiblePart();
        } else if (mouseClickMode === true && mouseClickedLeft === true) {
            mouseClickedLeft = false;

            await drawVisiblePart();
            let log = eyeTrackImage.get_click_log();
            let data = "";
            for (let i = 0; i < log.length; i++) {
                data += log[i].get_x() + "-" + log[i].get_y() + " ";
            }
            console.log(data);
        }
    }
}

/**
 * this is the "game loop" which will request an animation frame to loop.
 * It checks if the Image should be calculated new or we should work with the current image.
 */
async function running() {
    if (calculateNew === true) {
        image.src = imageUrl;
        shouldRenderNew = true;
    } else {
        await drawImage();
    }
    requestAnimationFrame(running);
}

/**
 * Setup the Tool for use
 */
async function setup() {
    if (UseCases.isValid() === false) {
        return;
    }
    eyeTrackImage = new ImageCalculator();
    if (UseCases.htmlTesting === true) {
        imageUrl = ex_1_url;
    }
    if (UseCases.soSciSurvey === true) {
        debugger
        document.getElementById("submit0").addEventListener('click', function (event) {
            let log = eyeTrackImage.get_click_log();
            let data = "";
            for (let i = 0; i < log.length; i++) {
                data += log[i].get_x() + "-" + log[i].get_y() + " ";
            }
            (<HTMLInputElement>document.getElementById(variableName)).value = data;
        });
        calculateNew = true;

        //add variables if there are some
        let x_blur_element = document.getElementById("x_blur_radius")
        if (x_blur_element != null) {
            x_blur_radius = Number(x_blur_element.innerHTML)
        }
        let y_blur_element = document.getElementById("y_blur_radius")
        if (y_blur_element != null) {
            y_blur_radius = Number(y_blur_element.innerHTML)
        }
        let grad_radius_element = document.getElementById("grad_radius")
        if (grad_radius_element != null) {
            grad_radius = Number(grad_radius_element.innerHTML)
        }
        let minimal_width_element = document.getElementById("minimal_width")
        if (minimal_width_element != null) {
            minimal_width = Number(minimal_width_element.innerHTML)
        }
        let minimal_height_element = document.getElementById("minimal_height")
        if (minimal_height_element != null) {
            minimal_height = Number(minimal_height_element.innerHTML)
        }
    }
    /**
     * starts the "game-loop"
     */
    await running();
}

requestAnimationFrame(setup);