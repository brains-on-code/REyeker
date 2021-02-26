
export class Helpers{
    /**
     * creates an array of the given size
     *
     * @param size
     */
    static array_of_size(size : number) : number[]{
        let temp : number[] = [];
        for(let i=0; i<size; i++){
            temp.push(0);
        }
        return temp;
    }
}