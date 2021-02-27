import {clickDataSaver} from "./clickDataSaver";
import {Coordinate} from "./Coordinate";
import {drawLineView, drawShapeView, drawRowView} from "./BoxDiagram";
import {drawVerticalLineDiagram, drawHorizontalLineDiagram} from "./LineDiagram";
import {drawHorizontalHeatMap, drawShapeHeatMap, drawVerticalHeatMap} from "./Heatmaps";
import {SemanticClassifier} from "./SemanticClassifier";
import * as html_doc from "./htmlImports";
import * as NW from "./NeedlemanWunschLineDiagram"
import * as Utils from "./Utils";

/**
 * A Section for global variables
 */
let semanticClassifier: SemanticClassifier = null;
let shouldRenderNew: boolean = true; //a boolean value, used to indicate if the canvas should be re rendered
let redrawClickLog: boolean = false; //a boolean value, used to indicate if the click log should be rendered new, used for history
let drawSNW: boolean = false;
let drawCNW: boolean = false;
let imageUrl: string; //the img which will be loaded
let indicatorCNWBuffers: boolean[] = [];
let semanticClassifier_top: number = null;
let semanticClassifier_bottom: number = null;

let importedData = null;

/**
 * a function thats sets the flag so the clickLog is drawn
 */
function setRedrawClickLog() {
    redrawClickLog = true;
    drawSNW = false;
    drawCNW = false;
}

/**
 * a function that sets the flag so the single needleman wunsch is drawn
 */
function setDrawSNW() {
    redrawClickLog = false;
    drawSNW = true;
    drawCNW = false;
}

/**
 * a function that sets the flag so the Combinded needleman wunsch is drawn
 */
function setDrawCNW() {
    redrawClickLog = false;
    drawSNW = false;
    drawCNW = true;
}

/**
 * reads the image path and sets this image, deletes the click log data set
 */
html_doc.imageDataAnalysisButton.addEventListener('click', function () {
    clickDataSaver.imageWithDataOfClickLog = html_doc.imageDataAnalysisInput.value;
    clickDataSaver.clickLogData = [];
    indicatorCNWBuffers = [];
    imageUrl = clickDataSaver.imageWithDataOfClickLog;

    Utils.set_data_for_scrollbar(html_doc.clickLogDataSetBar, String(0), String(0), String(0));
    Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(0), String(0));
    Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));

    shouldRenderNew = true;
})

/**
 * function to load the image and set meta data for the program
 */
html_doc.image.onload = function () {
    html_doc.canvas.width = 2 * html_doc.image.width;
    html_doc.canvas.height = html_doc.image.height;

    html_doc.clickLogCanvas.width = 2 * html_doc.image.width
    html_doc.clickLogCanvas.height = html_doc.image.height;

    html_doc.semanticClassifierCanvas.width = 2 * html_doc.image.width
    html_doc.semanticClassifierCanvas.height = html_doc.image.height;

    html_doc.ctx.drawImage(html_doc.image, 0, 0, html_doc.image.width, html_doc.image.height);

    semanticClassifier = new SemanticClassifier(html_doc.image.height);
    clickDataSaver.clear_current_log();
    clickDataSaver.imageWithDataOfClickLog = html_doc.image.src;

    if(importedData != null){
        clickDataSaver.set_current_log(importedData);

        semanticClassifier.import_semantic_classifier_from_JSON(importedData);

        Utils.set_data_for_scrollbar(html_doc.clickLogDataSetBar, String(0), String(clickDataSaver.clickLogData.length -1), String(0));
        html_doc.dataSetNumberOutput.innerHTML = "0";
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(clickDataSaver.get_current_log().length-1), String(0));
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
    }else{
        Utils.set_data_for_scrollbar(html_doc.clickLogDataSetBar, String(0), String(0), String(-1))
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0))
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(0), String(0))
    }

    shouldRenderNew = false;
};

/**
 * pushes an data set for analysing the current image
 */
html_doc.dataDataAnalysisButton.addEventListener('click', function () {
    clickDataSaver.string_to_click_log(html_doc.dataDataAnalysisInput.value);
    clickDataSaver.string_to_time_log(html_doc.timeDataAnalysisInput.value);
    indicatorCNWBuffers.push(false);
    html_doc.clickLogDataSetBar.max = String(clickDataSaver.clickLogData.length - 1);

    if (clickDataSaver.clickLogData.length === 1) {
        clickDataSaver.current = 0;
        html_doc.dataSetNumberOutput.innerHTML = `${clickDataSaver.current}`;

        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
        Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(clickDataSaver.get_current_log().length - 1), String(0));

        setRedrawClickLog();
    }
})


/**
 * a function to handle the change of max input, this will also change the range of the min input
 */
html_doc.clickLogActivationBarMax.oninput = function () {
    setRedrawClickLog();
    let min = String(0);
    let max = String(html_doc.clickLogActivationBarMax.value);
    let value = String(Math.min(Number(html_doc.clickLogActivationBarMin.value), Number(html_doc.clickLogActivationBarMax.value)));
    Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, min, max, value);
}

/**
 * a function to choose the dataSet which to analyse, will also update the clickLogActivationBarMax and clickLogActivationBarMin
 */
html_doc.clickLogDataSetBar.oninput = function () {
    clickDataSaver.current = Number(html_doc.clickLogDataSetBar.value)

    html_doc.dataSetNumberOutput.innerHTML = `${clickDataSaver.current}`;

    Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
    Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(clickDataSaver.get_current_log().length - 1), String(0));

    setRedrawClickLog();
};

/**
 * a function to switch between the sementic classifier states
 */
html_doc.SemanticClassifierCheckBoxNone.oninput = function () {
    html_doc.SemanticClassifierCheckBoxIdentifier.checked = false
    html_doc.SemanticClassifierCheckBoxExpression.checked = false
    html_doc.SemanticClassifierCheckBoxStructural.checked = false
    html_doc.SemanticClassifierCheckBoxNone.checked = true
}

/**
 * a function to switch between the sementic classifier states
 */
html_doc.SemanticClassifierCheckBoxIdentifier.oninput = function () {
    html_doc.SemanticClassifierCheckBoxIdentifier.checked = true
    html_doc.SemanticClassifierCheckBoxExpression.checked = false
    html_doc.SemanticClassifierCheckBoxStructural.checked = false
    html_doc.SemanticClassifierCheckBoxNone.checked = false
}

/**
 * a function to switch between the sementic classifier states
 */
html_doc.SemanticClassifierCheckBoxExpression.oninput = function () {
    html_doc.SemanticClassifierCheckBoxIdentifier.checked = false
    html_doc.SemanticClassifierCheckBoxExpression.checked = true
    html_doc.SemanticClassifierCheckBoxStructural.checked = false
    html_doc.SemanticClassifierCheckBoxNone.checked = false
}

/**
 * a function to switch between the sementic classifier states
 */
html_doc.SemanticClassifierCheckBoxStructural.oninput = function () {
    html_doc.SemanticClassifierCheckBoxIdentifier.checked = false
    html_doc.SemanticClassifierCheckBoxExpression.checked = false
    html_doc.SemanticClassifierCheckBoxStructural.checked = true
    html_doc.SemanticClassifierCheckBoxNone.checked = false
}

/**
 * a function to get the semantic value based on the checkboxes
 *  None - N
 *  Identifier - I
 *  Expression - E
 *  Structural - S
 */
function get_semantic_value(){
    if(html_doc.SemanticClassifierCheckBoxIdentifier.checked) return "I";
    if(html_doc.SemanticClassifierCheckBoxExpression.checked) return "E";
    if(html_doc.SemanticClassifierCheckBoxStructural.checked) return "S";
    return "N"
}

/**
 * a function for setting the top and the bottom for the semantic classifier
 * press shift for setting the top edge
 * press ctrl for setting the bottom edge
 */
html_doc.clickLogCanvas.addEventListener("mousedown", function (event: MouseEvent) {
    if (event.button === 0) {
        let mouseY = Math.floor(event.y - html_doc.clickLogCanvas.getBoundingClientRect().top)
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

/***
 * a function to start reading a file when the button is clicked
 */
html_doc.DataSetLoadButton.addEventListener("click", async function (){
    let fileName = html_doc.DataSetInput.value;
    await loadDataFrom(fileName);
});

/**
 * a function to start the conersation of the current enviroment into a json object and download it
 */
html_doc.DataSetSaveAsButton.addEventListener("click", async  function (){
    let fileName = html_doc.DataSetInput.value;
    await saveDataTo(fileName);
});

/**
 * a function to change the value redrawClickLog, used for redrawing the image, if indicators have changed
 */
let redrawIndicator = function () {
    setRedrawClickLog();
}

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

/**
 * a function to start the SNW calculation and will set a flöag to use this as output
 */
html_doc.SNWGoButton.addEventListener('click', function () {
    setDrawSNW();
});

/**
 * a function to start the SNW calculation and will set a flöag to use this as output
 */
html_doc.CNWGoButton.addEventListener('click', function () {
    setDrawCNW();
});

/**
 * a function to push data for the CNW
 */
html_doc.CNWPushButton.addEventListener('click', function () {
    let dataString = html_doc.CNWDataInput.value;
    let dataArray = dataString.split(" ");
    for (let i = 0; i < dataArray.length; i++) {
        let number = Number(dataArray[i]);
        if (number >= 0 && number < clickDataSaver.clickLogData.length) {
            indicatorCNWBuffers[number] = true;
        }
    }
    html_doc.CNWDataInput.value = "";
    let OutputStr = "";
    for (let i = 0; i < clickDataSaver.clickLogData.length; i++) {
        if (indicatorCNWBuffers[i] === true) {
            OutputStr = OutputStr + ` ${i}`;
        }
    }
    html_doc.CNWDataPreview.value = OutputStr;

});

/**
 * a function to reset the total data of the CNW
 */
html_doc.CNWResetButton.addEventListener('click', function () {
    for (let i = 0; i < clickDataSaver.clickLogData.length; i++) {
        indicatorCNWBuffers[i] = false;
    }
    html_doc.CNWDataPreview.value = "[None]";
})

/**
 * TODO
 *
 * a function to set the values for using the rectangle
 */
html_doc.RectangleSubmitButton.addEventListener('click', function(){
    clickDataSaver.minimal_width = parseInt(html_doc.RectangleMinimalWidthInput.value);
    clickDataSaver.minimal_height = parseInt(html_doc.RectangleMinimalHeightInput.value);
    clickDataSaver.grad_radius = parseInt(html_doc.RectangleGradientRadiusInput.value);
    clickDataSaver.use_rectangle = true;
    clickDataSaver.use_circle = false;
    clickDataSaver.use_ellipse = false;
    setRedrawClickLog();
})

/**
 * TODO
 *
 * a function to set the values for using the circle
 */
html_doc.CircleSubmitButton.addEventListener('click', function(){
    clickDataSaver.radius = parseInt(html_doc.CircleRadiusInput.value);
    clickDataSaver.grad_radius = parseInt(html_doc.CircleGradientRadiusInput.value);
    clickDataSaver.use_rectangle = false;
    clickDataSaver.use_circle = true;
    clickDataSaver.use_ellipse = false;
    setRedrawClickLog();
})

/**
 * TODO
 *
 * a function to set the values for using the ellipse
 */
html_doc.EllipseSubmitButton.addEventListener('click', function(){
    clickDataSaver.radius_x = parseInt(html_doc.EllipseXRadiusInput.value);
    clickDataSaver.radius_y = parseInt(html_doc.EllipseYRadiusInput.value);
    clickDataSaver.grad_radius = parseInt(html_doc.EllipseGradientRadiusInput.value);
    clickDataSaver.use_rectangle = false;
    clickDataSaver.use_circle = false;
    clickDataSaver.use_ellipse = true;
    setRedrawClickLog();
})


/**
 * loads image data async from a file
 *
 * @param filename
 */
async function loadDataFrom(filename : String){
    let JSONData = JSON.parse(await Utils.loadFile("data/" + filename));
    //make updates based oin image now
    imageUrl = clickDataSaver.imageWithDataOfClickLog;
    html_doc.image.src = imageUrl;

    //set flag so the new semantix classifier will be set
    importedData = JSONData;
}

/**
 * creates the file and download it
 *
 * @param filename
 */
async function saveDataTo(filename : String){
    let dataObject = {};
    clickDataSaver.imageWithDataOfClickLog = imageUrl;
    dataObject = clickDataSaver.add_current_to_object(dataObject);
    dataObject = semanticClassifier.add_current_to_object(dataObject);
    await Utils.download(filename, JSON.stringify(dataObject));

}

/**
 * draws the clear part and the click log onto the canvas, the click log will have an circle at the first click.
 * the further the click log activation bar, the further the history is drawn
 */
function drawClickLog() {
    const context: CanvasRenderingContext2D = html_doc.clickLogCanvas.getContext("2d");
    context.clearRect(0, 0, html_doc.clickLogCanvas.width, html_doc.clickLogCanvas.height);


    const buffer: Coordinate[] = clickDataSaver.get_current_log();
    const maxLog: number = Number(html_doc.clickLogActivationBarMax.value);
    const minLog: number = Number(html_doc.clickLogActivationBarMin.value);

    const lineView: boolean = html_doc.lineViewCheckBox.checked;
    const rowView: boolean = html_doc.rowViewCheckbox.checked;
    const rectangleView: boolean = html_doc.rectangleViewCheckbox.checked;

    let verticalView: boolean = html_doc.verticalViewCheckbox.checked;
    let horizontalView: boolean = html_doc.horizontalViewCheckbox.checked;

    let verticalHeatMap: boolean = html_doc.verticalHeatmapCheckbox.checked;
    let horizontalHeatMap: boolean = html_doc.horizontalHeatmapCheckbox.checked;
    let rectangleHeatMap: boolean = html_doc.rectangleHeatmapCheckbox.checked;

    if (rectangleView === true) drawShapeView(context, buffer[maxLog]);
    if (lineView === true) drawLineView(context, buffer[maxLog], html_doc.image.width);
    if (rowView === true) drawRowView(context, buffer[maxLog], html_doc.image.height);

    if (verticalView === true) drawVerticalLineDiagram(context, minLog, maxLog, buffer, html_doc.image.width);
    if (horizontalView === true) drawHorizontalLineDiagram(context, minLog, maxLog, buffer);


    if (verticalHeatMap === true) drawVerticalHeatMap(context, minLog, maxLog, buffer, html_doc.image.width, html_doc.image.height);
    if (horizontalHeatMap === true) drawHorizontalHeatMap(context, minLog, maxLog, buffer, html_doc.image.width, html_doc.image.height);
    if (rectangleHeatMap === true) drawShapeHeatMap(context, minLog, maxLog, buffer, html_doc.image.width, html_doc.image.height);

    semanticClassifier.drawToLabel(buffer, minLog, maxLog, html_doc.SemanticClassifierOutput);
}

/**
 * a function to draw and calculate the single comparisment Needleman Wunsch Algorithm
 */
function drawVerticalSNW() {
    const context: CanvasRenderingContext2D = html_doc.clickLogCanvas.getContext("2d");
    context.clearRect(0, 0, html_doc.clickLogCanvas.width, html_doc.clickLogCanvas.height);
    let buffer1Number = Number(html_doc.SNWDataInput1.value)
    let buffer2Number = Number(html_doc.SNWDataInput2.value)
    let rounding = Number(html_doc.SNWRoundingInput.value)
    if (buffer1Number >= 0 && buffer1Number < clickDataSaver.clickLogData.length) {
        if (buffer2Number >= 0 && buffer2Number < clickDataSaver.clickLogData.length) {
            let coordinate1Buffer : Coordinate[] = clickDataSaver.clickLogData[buffer1Number]
            let coordinate2Buffer : Coordinate[]= clickDataSaver.clickLogData[buffer2Number]
            if(html_doc.SemanticClassifierSNWFlag.checked){
                coordinate1Buffer = semanticClassifier.alignToClassifier(coordinate1Buffer)
                coordinate2Buffer = semanticClassifier.alignToClassifier(coordinate2Buffer)
                rounding = 1;
            }
            NW.drawVerticalNeedlemanWunschLineDiagram(context, rounding, html_doc.image.width, coordinate1Buffer, coordinate2Buffer);

        } else {
            console.log(`Number ${buffer2Number} not in dataset`)
        }
    } else {
        console.log(`Number ${buffer2Number} not in dataset`)
    }
}

/**
 * a function to draw and calculate the combinded needleman wunsch data
 */
function drawVerticalCNW() {
    const context: CanvasRenderingContext2D = html_doc.clickLogCanvas.getContext("2d");
    context.clearRect(0, 0, html_doc.clickLogCanvas.width, html_doc.clickLogCanvas.height);

    let buffers = [];
    let rounding = Number(html_doc.CNWRoundingInput.value);

    for (let i = 0; i < indicatorCNWBuffers.length; i++) {
        if (indicatorCNWBuffers[i] === true) {
            buffers.push(clickDataSaver.clickLogData[i]);
        }
    }

    if(html_doc.SemanticClassifierCNWFlag.checked){
        for(let i=0; i<buffers.length; i++){
            buffers[i] = semanticClassifier.alignToClassifier(buffers[i])
        }
        rounding = 1;
    }

    NW.drawVerticalCNWLineDiagram(context, rounding, buffers);
}

function drawSemanticClassifier() {
    const context: CanvasRenderingContext2D = html_doc.semanticClassifierCanvas.getContext("2d");
    context.clearRect(0, 0, html_doc.clickLogCanvas.width, html_doc.clickLogCanvas.height);
    if (html_doc.SemanticClassifierCheckBoxShow.checked) {
        semanticClassifier.drawSemanticFields(context, html_doc.clickLogCanvas.width / 2 - 12)
    }
}

/**
 * draws the Image based on the state of the Image
 * either:
 *  draws the hole image new
 *  draws the click log
 *  draws the blurry buffer with visible part
 */
async function drawImage() {
    if (redrawClickLog === true) {
        redrawClickLog = false;
        if (!(clickDataSaver.current === -1)) {
            drawClickLog();
        }
        drawSemanticClassifier();
    } else if (drawSNW) {
        drawSNW = false;
        drawVerticalSNW();
    } else if (drawCNW) {
        drawCNW = false;
        drawVerticalCNW();
    }
}

/**
 * this is the "game loop" which will request an animation frame to loop.
 * It checks if the Image should be calculated new or we should work with the current image.
 */
async function running() {
    if(semanticClassifier_bottom != null && semanticClassifier_top != null){
        let semanticValue = get_semantic_value()
        semanticClassifier.setSemanticFields(semanticClassifier_top, semanticClassifier_bottom, semanticValue)
        redrawClickLog = true;
        semanticClassifier_bottom = null;
        semanticClassifier_top = null;
    }
    if (shouldRenderNew === true) {
        html_doc.image.src = imageUrl;
        shouldRenderNew = false;
    } else {
        await drawImage();
    }
    requestAnimationFrame(running);
}

/**
 * Setup the Tool for use
 */
async function setup() {
    imageUrl = clickDataSaver.imageWithDataOfClickLog;
    html_doc.imageDataAnalysisInput.value = imageUrl;

    Utils.set_data_for_scrollbar(html_doc.clickLogDataSetBar, String(0), String(0), String(0));
    Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMax, String(0), String(0), String(0));
    Utils.set_data_for_scrollbar(html_doc.clickLogActivationBarMin, String(0), String(0), String(0));
    /**
     * starts the "game-loop"
     */
    await running();
}

setup();
