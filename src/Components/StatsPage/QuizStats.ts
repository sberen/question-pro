export interface Attempt {
  incorrectIndex: number[];
  time: firebase.firestore.Timestamp;
  grade: number;
}

export interface QuizSummary {
  attemptCnt: number;
  wrongCnt: number;
}


export class QuizStats {
  name: string;
  attempts: any;
  lastAttempt: number;
  overall: QuizSummary;
  wrongQCount: number[];
  questions: any[];
  type: string;

  constructor(name:string, attempts: any, lastAttempt: number, overall: QuizSummary, wrongQCount: number[], questions:any[], type: string) {
    this.name = name;
    this.attempts = attempts;
    this.lastAttempt = lastAttempt;
    this.overall = overall;
    this.wrongQCount = wrongQCount;
    this.questions = questions;
    this.type = type;
  }
}