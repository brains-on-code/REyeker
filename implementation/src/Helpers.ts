
export class Helpers{
    static array_of_size(size : number) : number[]{
        let temp : number[] = [];
        for(let i=0; i<size; i++){
            temp.push(0);
        }
        return temp;
    }
}