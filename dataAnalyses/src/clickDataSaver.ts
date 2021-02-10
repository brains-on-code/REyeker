import {Coordinate} from "./Coordinate";

/**
 * a class to save the current data based on an image and the inoput values
 */
export class clickDataSaver{
    public static imageWithDataOfClickLog = "./images/InsertSort.PNG";
    public static clickLogData : Coordinate[][] = [];
    public static current = -1;

    public static grad_radius = 30;
    public static minimal_width = 200;
    public static minimal_height = 1;

    /**
     * gets a string and formats that to a click log vector, the string should be formatted like "x1-y1 x2-y2 ... xn-yn"
     *
     * @param data_str the data which to format
     */
    public static string_to_click_log(data_str: string){
        let coordinates_pair_tuples_String: string[] = data_str.split(" ");
        let click_log_vector: Coordinate[] = [];
        for (let i = 0; i < coordinates_pair_tuples_String.length; i++) {
            let coord_string: string[] = coordinates_pair_tuples_String[i].split("-");
            let coord: Coordinate = new Coordinate(Number(coord_string[0]), Number(coord_string[1]));
            click_log_vector.push(coord);
        }
        clickDataSaver.clickLogData.push(click_log_vector);
    }

    /**
     * returns the ccurrent active data
     */
    public static get_current_log(){
        return clickDataSaver.clickLogData[clickDataSaver.current];
    }

    /**
     * clears all the data
     */
    public static clear_current_log(){
        clickDataSaver.clickLogData = [];
        clickDataSaver.current = -1;
        clickDataSaver.grad_radius = 30;
        clickDataSaver.minimal_width = 200;
        clickDataSaver.minimal_height = 1;
        clickDataSaver.imageWithDataOfClickLog = "./images/InsertSort.PNG";
    }

    /**
     * sets the data based on a JSON object
     */
    public static set_current_log(dataToSet : Object){
        if("imageName" in dataToSet){
            clickDataSaver.imageWithDataOfClickLog = dataToSet["imageName"]
        }
        if("data" in dataToSet){
            let dataString : [string] = dataToSet["data"];
            for(let i=0; i<dataString.length; i++){
                let data : string = dataString[i];
                clickDataSaver.string_to_click_log(data)
            }
            if(clickDataSaver.clickLogData.length > 0){
                clickDataSaver.current = 0;
            }
        }
        if("grad_radius" in dataToSet){
            clickDataSaver.grad_radius = dataToSet["grad_radius"]
        }
        if("minimal_width" in dataToSet){
            clickDataSaver.minimal_width = dataToSet["minimal_width"]
        }
        if("minimal_height" in dataToSet){
            clickDataSaver.minimal_height = dataToSet["minimal_height"]
        }

    }

    /**
     * adds a all the inten data to a object for JSON conversation
     */
    public static add_current_to_object(object_to_add_on){
        object_to_add_on["imageName"] = clickDataSaver.imageWithDataOfClickLog;
        object_to_add_on["grad_radius"] = clickDataSaver.grad_radius;
        object_to_add_on["minimal_width"] = clickDataSaver.minimal_width;
        object_to_add_on["minimal_height"] = clickDataSaver.minimal_height;
        let clickLogStringArray = [];
        for(let i=0; i<clickDataSaver.clickLogData.length; i++){
            let oneDataSet = "";
            for(let j=0; j<clickDataSaver.clickLogData[i].length; j++){
                oneDataSet += clickDataSaver.clickLogData[i][j].stringify();
                if(j!=clickDataSaver.clickLogData[i].length-1){
                    oneDataSet += " ";
                }
            }
            clickLogStringArray.push(oneDataSet)
        }
        object_to_add_on["data"] = clickLogStringArray;
        return object_to_add_on
    }

}