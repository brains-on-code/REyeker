import {Coordinate} from "./Coordinate";

/**
 * a class to save the current data based on an image and the inoput values
 */
export class clickDataSaver{
    public static imageWithDataOfClickLog = "./images/InsertSort.PNG";
    public static clickLogData : Coordinate[][] = [];
    public static timeLogData : number[][] = [];
    public static current = -1;

    public static use_times = true;
    public static use_rectangle = true;
    public static use_circle = false;
    public static use_ellipse = false;
    public static grad_radius = 30;

    public static minimal_width = 200;
    public static minimal_height = 1;

    public static radius = 50;

    public static radius_x = 100;
    public static radius_y = 50;

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
     * gets a string and formats that to a time log vector, the string should be formatted like "t1 t2 t3 ... tn"
     *
     * @param data_str the data which to format
     */
    public static string_to_time_log(data_str: string){
        let time_String: string[] = data_str.split(" ");
        let time_log_vector: number[] = [];
        for (let i = 0; i < time_String.length; i++) {
            let time_stamp: number = parseInt(time_String[i]);
            time_log_vector.push(time_stamp);
        }
        clickDataSaver.timeLogData.push(time_log_vector);
        if(clickDataSaver.timeLogData[clickDataSaver.timeLogData.length-1].length != clickDataSaver.clickLogData[clickDataSaver.clickLogData.length-1].length){
            clickDataSaver.use_times = false;
        }
    }

    /**
     * returns the ccurrent active data
     */
    public static get_current_log(){
        return clickDataSaver.clickLogData[clickDataSaver.current];
    }

    /**
     * returns the ccurrent active data
     */
    public static get_current_time_log(){
        return clickDataSaver.timeLogData[clickDataSaver.current];
    }

    /**
     * clears all the data
     */
    public static clear_current_log(){
        clickDataSaver.clickLogData = [];
        clickDataSaver.timeLogData = [];
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
        if("use_times" in dataToSet){
            clickDataSaver.use_times = dataToSet["use_times"];
        }
        if("times" in dataToSet){
            let timeString : [string] = dataToSet["times"];
            for(let i=0; i<timeString.length; i++){
                let data : string = timeString[i];
                clickDataSaver.string_to_time_log(data)
            }
        }
        if("grad_radius" in dataToSet){
            clickDataSaver.grad_radius = dataToSet["grad_radius"]
        }
        if("use_rectangle" in dataToSet && dataToSet["use_rectangle"] === true){
            clickDataSaver.use_rectangle = true;
            clickDataSaver.use_circle = false;
            clickDataSaver.use_ellipse = false;
            if("minimal_width" in dataToSet){
                clickDataSaver.minimal_width = dataToSet["minimal_width"]
            }
            if("minimal_height" in dataToSet){
                clickDataSaver.minimal_height = dataToSet["minimal_height"]
            }
        }else if("use_circle" in dataToSet && dataToSet["use_circle"] === true){
            clickDataSaver.use_rectangle = false;
            clickDataSaver.use_circle = true;
            clickDataSaver.use_ellipse = false;
            if("radius" in dataToSet){
                clickDataSaver.radius = dataToSet["radius"];
            }
        }else if("use_ellipse" in dataToSet && dataToSet["use_ellipse"] === true){
            clickDataSaver.use_rectangle = false;
            clickDataSaver.use_circle = false;
            clickDataSaver.use_ellipse = true;
            if("radius_x" in dataToSet){
                clickDataSaver.radius_x = dataToSet["radius_x"];
            }else if("radius_y" in dataToSet){
                clickDataSaver.radius_y = dataToSet["radius_y"];
            }
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
        object_to_add_on["radius"] = clickDataSaver.radius;
        object_to_add_on["radius_x"] = clickDataSaver.radius_x;
        object_to_add_on["radius_y"] = clickDataSaver.radius_y;
        object_to_add_on["use_rectangle"] = clickDataSaver.use_rectangle;
        object_to_add_on["use_circle"] = clickDataSaver.use_circle;
        object_to_add_on["use_ellipse"] = clickDataSaver.use_ellipse;
        object_to_add_on["use_times"] = clickDataSaver.use_times;
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

        let timeLogSringArray = [];
        for(let i=0; i<clickDataSaver.timeLogData.length; i++){
            let oneDataSet = "";
            for(let j=0; j<clickDataSaver.timeLogData[i].length; j++){
                oneDataSet += clickDataSaver.timeLogData[i][j];
                if(j!=clickDataSaver.clickLogData[i].length-1){
                    oneDataSet += " ";
                }
            }
            timeLogSringArray.push(oneDataSet)
        }
        if(timeLogSringArray.length != 0){
            object_to_add_on["times"] = timeLogSringArray;
        }

        return object_to_add_on
    }

}