
export class UseCases{
    public static htmlTesting = false;
    public static soSciSurvey = true;


    public static isValid() : boolean{
        let value : number = 0;
        if(UseCases.htmlTesting === true) value++;
        if(UseCases.soSciSurvey === true) value++;
        return value === 1;
    }
}