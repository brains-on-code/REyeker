
import {Coordinate} from "./Coordinate";

/**
 * a function used to split the image into semantic classifiers sourc efor this is the following paper:
 *
 * https://www.semanticscholar.org/paper/Developing-Coding-Schemes-for-Program-Comprehension-Busjahn-Schulte/2a3a46e8d7024a6f1fc5c3c926bcb70367ef8a03?p2df
 */
export class SemanticClassifier{
    readonly semanticFields : String[] = null;
    private readonly height : number = null

    /**
     * sets all values based on the heigfht of the image
     *
     * @param height        the height of the image to classify
     */
    constructor(height: number) {
        this.height = height;
        this.semanticFields = [];
        for(let i=0; i<height; i++){
            this.semanticFields.push("N")
        }
    }

    /**
     * sets the value to the semantic field and overrides the rest
     *
     * @param start     start index inclusive
     * @param end       end index exclusive
     * @param value     value to set
     */
    public setSemanticFields(start: number, end: number, value: String){
        for(let i=start; i<end; i++){
            this.semanticFields[i] = value;
        }
    }

    /**
     * returns a array of tuples the tuples descripe the range and the value of the intervall
     *
     * tuple[0] start value inclusive
     * tuple[1] end value exclusive
     * tuple[2] value
     */
    public getSemanticFields() : [number, number, String][]{
        let result : [number, number, String][] = [];
        let start = 0;
        let current = this.semanticFields[0];
        for(let i=0; i<this.height; i++){
            if(this.semanticFields[i]!=current){
                result.push([start, i, current])
                start = i;
                current = this.semanticFields[i];
            }
        }
        result.push([start, this.height, current]);

        return result;
    }

    /**
     * aligns the given buffer to the middle of the classifiers
     *
     * @param buffer        the buffer which should be alignt to the classifier
     */
    public alignToClassifier(buffer : Coordinate[]) : Coordinate[]{
        let tmpBuffer : Coordinate[] = [];
        let semanticField = this.getSemanticFields();
        for(let coordinate of buffer){
            let value = coordinate.get_y();
            let new_value = this.alignToSemanticField(semanticField, value);
            tmpBuffer.push(new Coordinate(coordinate.get_x(), new_value))
        }
        return tmpBuffer;
    }

    /**
     * draws the semantic intervals on the  contex
     *
     * @param context       the context to draw to
     * @param width         the half width where to draw to
     */
    public drawSemanticFields(context: CanvasRenderingContext2D, width : number){
        let fields = this.getSemanticFields();
        for(let i=0; i<fields.length; i++){
            let field = fields[i];
            context.beginPath();
            context.moveTo(0, field[1]);
            context.lineTo(width*2, field[1]);
            context.stroke();
            this.drawLetter(context, width, field[0]+3, field[2]);
        }
    }

    /**
     * a function to draw the semantic classifier based on the buffer
     *
     * @param buffer    the buffer with the click log data
     * @param min       where to start in the buffer
     * @param max       where to end in the buffer inclusive
     * @param label     the label where to write to
     */
    public drawToLabel(buffer: Coordinate[], min: number, max: number, label: HTMLLabelElement){
        let semanticBuffer = this.getSemanticFields();
        let resultStr : String = "";
        for(let i=min; i<=max; i++){
            try {
                let intervalOfPoint = this.getFieldOfPoint(semanticBuffer, buffer[i].get_y())
                let strValue = intervalOfPoint[2];
                resultStr = resultStr.concat(strValue.toString());
                if (i != max) {
                    resultStr = resultStr.concat(" - ");
                }
            }catch (error){

            }
        }
        label.innerText = resultStr.toString();
    }

    /***
     * a function to clear the semantic Classifier
     */
    public clear(){
        for(let i=0; i<this.height; i++){
            this.semanticFields[i]= "N"
        }
    }

    /***
     * a function to set the semantic Classifier based on a input object
     */
    public import_semantic_classifier_from_JSON(imported_Object: Object){
        if("semanticClassifier" in imported_Object){
            let data_array : [Object]= imported_Object["semanticClassifier"]
            for(let i=0; i<data_array.length; i++){
                let elemt = data_array[i];
                let top : number = elemt["top"];
                let bot : number = elemt["bot"];
                let classifier : String = elemt["classifier"];
                this.setSemanticFields(top, bot, classifier)
            }
        }
    }

    /***
     * a function to add the semantic classifier to the given object
     */
    public add_current_to_object(object_to_add_on){
        let classifiers = this.getSemanticFields()
        let dataToAdd = [];
        for(let i=0; i<classifiers.length; i++){
            let tmp = {
                top : classifiers[i][0],
                bot : classifiers[i][1],
                classifier : classifiers[i][2]
            }
            dataToAdd.push(tmp)
        }
        object_to_add_on["semanticClassifier"] = dataToAdd;
        return object_to_add_on;
    }

    /**
     * a function that return the interval with the label, where to point lies
     *
     * @param semanticField     the range abased semantic field
     * @param value             the value which will be used
     */
    private getFieldOfPoint(semanticField: [number, number, String][], value: number) : [number, number, String]{
        for(let i=0; i<semanticField.length; i++){
            if(value >= semanticField[i][0]  && value < semanticField[i][1]){
                return [semanticField[i][0], semanticField[i][1], semanticField[i][2]];
            }
        }
        return null;
    }

    /**
     * aligns a value to the middle of the fitting semantic field
     *
     * @param semanticField     the range based semantiic field
     * @param value             the value which should be alignt
     */
    private alignToSemanticField(semanticField: [number, number, String][], value: number){
        for(let i=0; i<semanticField.length; i++){
            if(value >= semanticField[i][0] && value < semanticField[i][1]){
                return Math.floor((semanticField[i][1]+semanticField[i][0])/2);
            }
        }
        return 0;
    }

    /**
     * draws an N to to context
     *
     * @param context
     * @param startWidth
     * @param startHeight
     * @private
     */
    private drawN(context: CanvasRenderingContext2D, startWidth: number, startHeight: number){
        context.beginPath();
        context.moveTo(startWidth, startHeight+10);
        context.lineTo(startWidth, startHeight);
        context.lineTo(startWidth+8, startHeight+10);
        context.lineTo(startWidth+8, startHeight);
        context.stroke();
    }

    /**
     * draws an S to to context
     *
     * @param context
     * @param startWidth
     * @param startHeight
     * @private
     */
    private drawS(context: CanvasRenderingContext2D, startWidth: number, startHeight: number){
        context.beginPath();
        context.moveTo(startWidth+8, startHeight);
        context.lineTo(startWidth, startHeight);
        context.lineTo(startWidth, startHeight+5);
        context.lineTo(startWidth+8, startHeight+5);
        context.lineTo(startWidth+8, startHeight+10);
        context.lineTo(startWidth, startHeight+10);
        context.stroke();
    }

    /**
     * draws an E to to context
     *
     * @param context
     * @param startWidth
     * @param startHeight
     * @private
     */
    private drawE(context: CanvasRenderingContext2D, startWidth: number, startHeight: number){
        context.beginPath();
        context.moveTo(startWidth+8, startHeight);
        context.lineTo(startWidth, startHeight);
        context.lineTo(startWidth, startHeight+5);
        context.lineTo(startWidth+8, startHeight+5);
        context.lineTo(startWidth, startHeight+5);
        context.lineTo(startWidth, startHeight+10);
        context.lineTo(startWidth+8, startHeight+10);
        context.stroke();
    }

    /**
     * draws an I to to context
     *
     * @param context
     * @param startWidth
     * @param startHeight
     * @private
     */
    private drawI(context: CanvasRenderingContext2D, startWidth: number, startHeight: number){
        context.beginPath();
        context.moveTo(startWidth, startHeight);
        context.lineTo(startWidth+8, startHeight);
        context.lineTo(startWidth+4, startHeight);
        context.lineTo(startWidth+4, startHeight+10);
        context.lineTo(startWidth+8, startHeight+10);
        context.lineTo(startWidth, startHeight+10);
        context.stroke();
    }

    /**
     * draw a letter tzo a context (N, I, S, E)
     *
     * @param context
     * @param startWidth
     * @param startHeight
     * @param letter
     * @private
     */
    private drawLetter(context: CanvasRenderingContext2D, startWidth: number, startHeight: number, letter: String){
        if(letter === "N") this.drawN(context, startWidth, startHeight);
        if(letter === "I") this.drawI(context, startWidth, startHeight);
        if(letter === "S") this.drawS(context, startWidth, startHeight);
        if(letter === "E") this.drawE(context, startWidth, startHeight);
    }

}