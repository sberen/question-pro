export interface Attempt {
  incorrectIndex: number[];
  time: firebase.firestore.Timestamp;
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

  constructor(name:string, attempts: any, lastAttempt: number, overall: QuizSummary, wrongQCount: number[]) {
    this.name = name;
    this.attempts = attempts;
    this.lastAttempt = lastAttempt;
    this.overall = overall;
    this.wrongQCount = wrongQCount;
  }
}