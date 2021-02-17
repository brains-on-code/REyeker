/**
 * A Section for used html references
 */
export let clickLogCanvas: HTMLCanvasElement;//canvas for drawing the clickLog used for speeding up;
export let semanticClassifierCanvas: HTMLCanvasElement; //canvas for drawing the semantic classifier
export let clickLogActivationBarMax: HTMLInputElement; //a scrollbar for going forward and backward in the history of clicks, showing the max value
export let clickLogActivationBarMin: HTMLInputElement; //a scrollbar for going forward and backward in the history of clicks, showing the min value
export let clickLogDataSetBar: HTMLInputElement; //a scrollbar to switch the used dataset
export let lineViewCheckBox: HTMLInputElement; // a checkbox to indicate if the line View should be drawn
export let rowViewCheckbox: HTMLInputElement;// a checkbox to indicate if the row View should be drawn
export let rectangleViewCheckbox: HTMLInputElement;// a checkbox to indicate if the rectangle View should be drawn
export let verticalViewCheckbox: HTMLInputElement;// a checkbox to indicate if the vertical View should be drawn
export let horizontalViewCheckbox: HTMLInputElement;// a checkbox to indicate if the horizontal View should be drawn
export let verticalHeatmapCheckbox: HTMLInputElement;// a checkbox to indicate if the vertical heatmap View should be drawn
export let horizontalHeatmapCheckbox: HTMLInputElement;// a checkbox to indicate if the horizontal heatmap View should be drawn
export let rectangleHeatmapCheckbox: HTMLInputElement;// a checkbox to indicate if the rectangle heatmap View should be drawn
export let imageDataAnalysisInput: HTMLInputElement;// set the Image url of the image to analyse
export let imageDataAnalysisButton: HTMLInputElement;// set the Image url of the image to analyse button
export let dataDataAnalysisInput: HTMLInputElement;// push the data for the used image
export let timeDataAnalysisInput: HTMLInputElement;// push the data for the used image
export let dataDataAnalysisButton: HTMLInputElement;// push the data for the used image button
export let dataSetNumberOutput: HTMLLabelElement; // a label for displaying the currently used dataset

export let SNWRoundingInput: HTMLInputElement; //input to get the rounding number for SNW
export let SNWDataInput1: HTMLInputElement; //Input for getting the first dataset number
export let SNWDataInput2: HTMLInputElement; //Input for getting the second dataset number
export let SNWGoButton: HTMLInputElement; //input to start the SNW calculation

export let CNWRoundingInput: HTMLInputElement; //Input for CNW algorithm
export let CNWDataInput: HTMLInputElement; //Input for numbers of datasets for the CNW
export let CNWDataPreview: HTMLInputElement; //Preview for the datasets
export let CNWPushButton: HTMLInputElement; //Button topush the input in the currently in use
export let CNWResetButton: HTMLInputElement; //input to reset the currently used data
export let CNWGoButton: HTMLInputElement; //input to start the calulation
export let SemanticClassifierSNWFlag: HTMLInputElement; //checkbox to get if semantic classifier should be used for snw
export let SemanticClassifierCNWFlag: HTMLInputElement; //checkbox to get if semantic classifier should be used for snw

export let SemanticClassifierCheckBoxShow: HTMLInputElement; // a checkbox to indicate that the semantic classifier should be drawn
export let SemanticClassifierCheckBoxNone: HTMLInputElement; // a checkbox to indicate that the semantic classifier is None
export let SemanticClassifierCheckBoxIdentifier: HTMLInputElement; // a checkbox to indicate that the semantic classifier is Identifier
export let SemanticClassifierCheckBoxStructural: HTMLInputElement; // a checkbox to indicate that the semantic classifier is Structural
export let SemanticClassifierCheckBoxExpression: HTMLInputElement; // a checkbox to indicate that the semantic classifier is Expression
export let SemanticClassifierOutput: HTMLLabelElement; // a output label for displaying the semantic classifier string

export let DataSetInput: HTMLInputElement; // a input label to get the file location
export let DataSetLoadButton: HTMLInputElement; // a Button to trigger the load event
export let DataSetSaveAsButton: HTMLInputElement; // a Button to trigger the save as event

export let RectangleMinimalWidthInput: HTMLInputElement; //text input for reading minimal width
export let RectangleMinimalHeightInput: HTMLInputElement;  // text input for reading minimal height
export let RectangleGradientRadiusInput: HTMLInputElement; // text input for reading gradient radius
export let RectangleSubmitButton: HTMLInputElement; //Button for using rectangle

export let CircleRadiusInput: HTMLInputElement; // text input for reading circle radius
export let CircleGradientRadiusInput: HTMLInputElement; // text input for reading ellipse radius
export let CircleSubmitButton: HTMLInputElement; //Button for using circle

export let EllipseXRadiusInput: HTMLInputElement; // text input for reading ellipse x radius
export let EllipseYRadiusInput: HTMLInputElement; // text input for reading ellipse y radius
export let EllipseGradientRadiusInput: HTMLInputElement; // text input for reading gradient radius
export let EllipseSubmitButton: HTMLInputElement; //Button for using ellipse


clickLogCanvas = <HTMLCanvasElement>document.getElementById("click-log-canvas");
semanticClassifierCanvas = <HTMLCanvasElement>document.getElementById("semantic-classifier");
clickLogActivationBarMax = <HTMLInputElement>document.getElementById("clickLogActivationBarMax");
clickLogActivationBarMin = <HTMLInputElement>document.getElementById("clickLogActivationBarMin");
clickLogDataSetBar = <HTMLInputElement>document.getElementById("clickLogDataSetBar");
lineViewCheckBox = <HTMLInputElement>document.getElementById("lineViewCheckbox");
rowViewCheckbox = <HTMLInputElement>document.getElementById("rowViewCheckbox");
rectangleViewCheckbox = <HTMLInputElement>document.getElementById("rectangleViewCheckbox");
verticalViewCheckbox = <HTMLInputElement>document.getElementById("verticalViewCheckbox");
horizontalViewCheckbox = <HTMLInputElement>document.getElementById("horizontalViewCheckbox");
verticalHeatmapCheckbox = <HTMLInputElement>document.getElementById("verticalHeatmapCheckbox");
horizontalHeatmapCheckbox = <HTMLInputElement>document.getElementById("horizontalHeatmapCheckbox");
rectangleHeatmapCheckbox = <HTMLInputElement>document.getElementById("rectangleHeatmapCheckbox");
imageDataAnalysisInput = <HTMLInputElement>document.getElementById("imageDataAnalysisInput");
imageDataAnalysisButton = <HTMLInputElement>document.getElementById("imageDataAnalysisButton");
timeDataAnalysisInput = <HTMLInputElement>document.getElementById("timeDataAnalysisInput");
dataDataAnalysisInput = <HTMLInputElement>document.getElementById("dataDataAnalysisInput");
dataDataAnalysisButton = <HTMLInputElement>document.getElementById("dataDataAnalysisButton");
SNWRoundingInput = <HTMLInputElement>document.getElementById("SNW_rounding");
SNWDataInput1 = <HTMLInputElement>document.getElementById("SNW_Input1");
SNWDataInput2 = <HTMLInputElement>document.getElementById("SNW_Input2");
SNWGoButton = <HTMLInputElement>document.getElementById("SNW_go");
CNWRoundingInput = <HTMLInputElement>document.getElementById("CNW_rounding");
CNWDataInput = <HTMLInputElement>document.getElementById("CNW_Input");
CNWDataPreview = <HTMLInputElement>document.getElementById("CNW_Preview");
CNWPushButton = <HTMLInputElement>document.getElementById("CNW_push");
CNWResetButton = <HTMLInputElement>document.getElementById("CNW_reset");
CNWGoButton = <HTMLInputElement>document.getElementById("CNW_go");
SemanticClassifierSNWFlag = <HTMLInputElement>document.getElementById("SemanticClassifierSNWFlag")
SemanticClassifierCNWFlag = <HTMLInputElement>document.getElementById("SemanticClassifierCNWFlag")
dataSetNumberOutput = <HTMLLabelElement>document.getElementById("currentDataSetLabel");
SemanticClassifierCheckBoxShow = <HTMLInputElement>document.getElementById("SemanticClassifierCheckBoxShow");
SemanticClassifierCheckBoxNone = <HTMLInputElement>document.getElementById("SemanticClassifierCheckBoxNone");
SemanticClassifierCheckBoxIdentifier = <HTMLInputElement>document.getElementById("SemanticClassifierCheckBoxIdentifier");
SemanticClassifierCheckBoxStructural = <HTMLInputElement>document.getElementById("SemanticClassifierCheckBoxStructural");
SemanticClassifierCheckBoxExpression = <HTMLInputElement>document.getElementById("SemanticClassifierCheckBoxExpression");
SemanticClassifierOutput = <HTMLLabelElement>document.getElementById("SemanticClassifierOutput");
DataSetInput = <HTMLInputElement>document.getElementById("datasetInput");
DataSetLoadButton = <HTMLInputElement>document.getElementById("datasetLoadButton");
DataSetSaveAsButton = <HTMLInputElement>document.getElementById("datasetSaveAsButton");
RectangleMinimalWidthInput = <HTMLInputElement>document.getElementById("minimalWidthInput");
RectangleMinimalHeightInput = <HTMLInputElement>document.getElementById("minimalHeightInput");
RectangleGradientRadiusInput = <HTMLInputElement>document.getElementById("rectangleGradRadiusInput");
RectangleSubmitButton = <HTMLInputElement>document.getElementById("useRectangle");
CircleRadiusInput = <HTMLInputElement>document.getElementById("radiusInput");
CircleGradientRadiusInput = <HTMLInputElement>document.getElementById("circleGradRadiusInput");
CircleSubmitButton = <HTMLInputElement>document.getElementById("useCircle");
EllipseXRadiusInput = <HTMLInputElement>document.getElementById("xRadiusInput");
EllipseYRadiusInput = <HTMLInputElement>document.getElementById("yRadiusInput");
EllipseGradientRadiusInput = <HTMLInputElement>document.getElementById("ellipseGradRadiusInput");
EllipseSubmitButton = <HTMLInputElement>document.getElementById("useEllipse");

/**
 * the canvas for the image
 */
export const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("bubble-image-canvas");
export let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

export let image: HTMLImageElement = new Image();

