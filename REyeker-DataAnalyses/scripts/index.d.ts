declare module "Coordinate" {
    export class Coordinate {
        private readonly x;
        private readonly y;
        constructor(x: number, y: number);
        get_x(): number;
        get_y(): number;
        stringify(): string;
    }
}
declare module "clickDataSaver" {
    import { Coordinate } from "Coordinate";
    export class clickDataSaver {
        static imageWithDataOfClickLog: string;
        static clickLogData: Coordinate[][];
        static timeLogData: number[][];
        static current: number;
        static use_times: boolean;
        static use_rectangle: boolean;
        static use_circle: boolean;
        static use_ellipse: boolean;
        static grad_radius: number;
        static minimal_width: number;
        static minimal_height: number;
        static radius: number;
        static radius_x: number;
        static radius_y: number;
        static string_to_click_log(data_str: string): void;
        static string_to_time_log(data_str: string): void;
        static get_current_log(): Coordinate[];
        static get_current_time_log(): number[];
        static clear_current_log(): void;
        static set_current_log(dataToSet: Object): void;
        static add_current_to_object(object_to_add_on: any): any;
    }
}
declare module "BoxDiagram" {
    import { Coordinate } from "Coordinate";
    export function drawShapeView(context: CanvasRenderingContext2D, current_coordinate: Coordinate): void;
    export function drawLineView(context: CanvasRenderingContext2D, current_coordinate: Coordinate, width: number): void;
    export function drawRowView(context: CanvasRenderingContext2D, current_coordinate: Coordinate, height: number): void;
}
declare module "Heatmaps" {
    import { Coordinate } from "Coordinate";
    export function drawShapeHeatMap(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], max_width: number, max_height: number): void;
    export function drawVerticalHeatMap(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], maxWidth: number, maxHeight: number): void;
    export function drawHorizontalHeatMap(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], maxWidth: number, maxHeight: number): void;
}
declare module "LineDiagram" {
    import { Coordinate } from "Coordinate";
    export function drawVerticalLineDiagram(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[], startWith?: number): void;
    export function drawHorizontalLineDiagram(context: CanvasRenderingContext2D, min: number, max: number, buffer: Coordinate[]): void;
}
declare module "NeedlemanWunsch" {
    export function NeedlemanWunsch(sequence_a: any, sequence_b: any): any[];
}
declare module "NeedlemanWunschLineDiagram" {
    import { Coordinate } from "Coordinate";
    export function drawVerticalNeedlemanWunschLineDiagram(context: CanvasRenderingContext2D, rounding: number, width: number, buffer_a: Coordinate[], buffer_b: Coordinate[]): void;
    export function drawHorizontalNeedlemanWunschLineDiagram(context: CanvasRenderingContext2D, rounding: number, height: number, buffer_a: Coordinate[], buffer_b: Coordinate[]): void;
    export function drawVerticalCNWLineDiagram(context: CanvasRenderingContext2D, rounding: number, buffers: any): void;
    export function drawHorizontalCNWLineDiagram(context: CanvasRenderingContext2D, rounding: number, buffers: any): void;
}
declare module "SemanticClassifier" {
    import { Coordinate } from "Coordinate";
    export class SemanticClassifier {
        readonly semanticFields: String[];
        private readonly height;
        constructor(height: number);
        setSemanticFields(start: number, end: number, value: String): void;
        getSemanticFields(): [number, number, String][];
        alignToClassifier(buffer: Coordinate[]): Coordinate[];
        drawSemanticFields(context: CanvasRenderingContext2D, width: number): void;
        drawToLabel(buffer: Coordinate[], min: number, max: number, label: HTMLLabelElement): void;
        clear(): void;
        import_semantic_classifier_from_JSON(imported_Object: Object): void;
        add_current_to_object(object_to_add_on: any): any;
        private getFieldOfPoint;
        private alignToSemanticField;
        private drawN;
        private drawS;
        private drawE;
        private drawI;
        private drawLetter;
    }
}
declare module "Utils" {
    export function loadFile(filePath: any): Promise<any>;
    export function download(filename: any, text: any): Promise<void>;
    export function set_data_for_scrollbar(scrollbar: HTMLInputElement, min: string, max: string, value: string): void;
}
declare module "htmlImports" {
    export let clickLogCanvas: HTMLCanvasElement;
    export let semanticClassifierCanvas: HTMLCanvasElement;
    export let clickLogActivationBarMax: HTMLInputElement;
    export let clickLogActivationBarMin: HTMLInputElement;
    export let clickLogDataSetBar: HTMLInputElement;
    export let lineViewCheckBox: HTMLInputElement;
    export let rowViewCheckbox: HTMLInputElement;
    export let rectangleViewCheckbox: HTMLInputElement;
    export let verticalViewCheckbox: HTMLInputElement;
    export let horizontalViewCheckbox: HTMLInputElement;
    export let verticalHeatmapCheckbox: HTMLInputElement;
    export let horizontalHeatmapCheckbox: HTMLInputElement;
    export let rectangleHeatmapCheckbox: HTMLInputElement;
    export let imageDataAnalysisInput: HTMLInputElement;
    export let imageDataAnalysisButton: HTMLInputElement;
    export let dataDataAnalysisInput: HTMLInputElement;
    export let timeDataAnalysisInput: HTMLInputElement;
    export let dataDataAnalysisButton: HTMLInputElement;
    export let dataSetNumberOutput: HTMLLabelElement;
    export let SNWRoundingInput: HTMLInputElement;
    export let SNWDataInput1: HTMLInputElement;
    export let SNWDataInput2: HTMLInputElement;
    export let SNWGoButton: HTMLInputElement;
    export let CNWRoundingInput: HTMLInputElement;
    export let CNWDataInput: HTMLInputElement;
    export let CNWDataPreview: HTMLInputElement;
    export let CNWPushButton: HTMLInputElement;
    export let CNWResetButton: HTMLInputElement;
    export let CNWGoButton: HTMLInputElement;
    export let SemanticClassifierSNWFlag: HTMLInputElement;
    export let SemanticClassifierCNWFlag: HTMLInputElement;
    export let SemanticClassifierCheckBoxShow: HTMLInputElement;
    export let SemanticClassifierCheckBoxNone: HTMLInputElement;
    export let SemanticClassifierCheckBoxIdentifier: HTMLInputElement;
    export let SemanticClassifierCheckBoxStructural: HTMLInputElement;
    export let SemanticClassifierCheckBoxExpression: HTMLInputElement;
    export let SemanticClassifierOutput: HTMLLabelElement;
    export let DataSetInput: HTMLInputElement;
    export let DataSetLoadButton: HTMLInputElement;
    export let DataSetSaveAsButton: HTMLInputElement;
    export let RectangleMinimalWidthInput: HTMLInputElement;
    export let RectangleMinimalHeightInput: HTMLInputElement;
    export let RectangleGradientRadiusInput: HTMLInputElement;
    export let RectangleSubmitButton: HTMLInputElement;
    export let CircleRadiusInput: HTMLInputElement;
    export let CircleGradientRadiusInput: HTMLInputElement;
    export let CircleSubmitButton: HTMLInputElement;
    export let EllipseXRadiusInput: HTMLInputElement;
    export let EllipseYRadiusInput: HTMLInputElement;
    export let EllipseGradientRadiusInput: HTMLInputElement;
    export let EllipseSubmitButton: HTMLInputElement;
    export const canvas: HTMLCanvasElement;
    export let ctx: CanvasRenderingContext2D;
    export let image: HTMLImageElement;
}
declare module "index" { }
