interface Attempt {
  incorrectIndex: number[];
  time: firebase.firestore.Timestamp;
}

export interface QuizSummary {
  attemptCount: number;
  wrongCount: number;
}


export class QuizStats {
  uid: string;
  attempts: any;
  lastAttempt: number;
  overall: QuizSummary;
  wrongQCount: number[];

  constructor(uid:string, attempts: any, lastAttempt: number, overall: QuizSummary, wrongQCount: number[]) {
    this.uid = uid;
    this.attempts = attempts;
    this.lastAttempt = lastAttempt;
    this.overall = overall;
    this.wrongQCount = wrongQCount;
  }
}