/**
 * A class which sets flags for the current use casses, different use cases execute other code, because of the enviroment
 */
export class UseCases{
    /**
     * Indicates that the REYEker tool will be used in on environment
     */
    public static htmlTesting = true;
    /**
     * Indicates that the REYEker tool will be uses on soSciSurvey
     */
    public static soSciSurvey = false;

    /**
     * checks if exactly one flag is set
     */
    public static isValid() : boolean{
        let value : number = 0;
        if(UseCases.htmlTesting === true) value++;
        if(UseCases.soSciSurvey === true) value++;
        return value === 1;
    }
}