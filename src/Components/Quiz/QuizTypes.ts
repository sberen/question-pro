import { QuizInfo } from "./QuizInfo";

interface Quiz {
  longName: string;
  shortName: string;
}

var mc = new QuizInfo('Multiple Choice Example', "MC", "00000001");
var vocab = new QuizInfo('Vocabulary Example', "SA", "00000002");
var conj = new QuizInfo('Conjugation Example', "MSA", "00000003");
var trans = new QuizInfo('Translation Example', "LA", "00000004");
export const QUIZZES = [mc, vocab, conj, trans];


export const QUIZ_TYPES: Quiz[] = [{
  longName: "Short Answer",
  shortName: "SA" 
}, {
  longName: "Multiple Choice",
  shortName: "MC"
}, {
  longName: "Multiple Short Answer",
  shortName: "MSA"
}, {
  longName: "Long Answer",
  shortName: "LA"
}];

export const QUIZ_INDICES: Map<string,number> = new Map<string,number>([
  ["SA", 0],
  ["MC", 1],
  ["MSA", 2],
  ["LA", 3]
])

export const SINGLE: string[] = ["MC", "SA", "LA"];