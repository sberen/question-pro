export class QuizInfoMini {
    name : string;
    type : string;
    uid : string;
    
    constructor(name?: string, type? : string, uid? : string, questions?: any[]){
        this.name = name ||"";
        this.type = type ||"";
        this.uid = uid || "";
    }
}