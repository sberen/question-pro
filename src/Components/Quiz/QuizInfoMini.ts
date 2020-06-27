// this class represents all the information
// needed to display a single quiz.
export class QuizInfoMini {
    name : string;
    type : string;
    uid : string;

    constructor(name?: string, type? : string, uid? : string){
        this.name = name ||"";
        this.type = type ||"";
        this.uid = uid || "";
    }
}