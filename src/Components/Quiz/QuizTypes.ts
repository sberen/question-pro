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

export const QUIZ_DESC: Map<string,string> = new Map<string,string>([
  ["SA", "This quiz is great for vocabulary testing, with a single prompt and an open ended response field."],
  ["MC", "This is your classic multiple choice quiz, with one question and a series of answer choices to choose from."],
  ["MSA", "This quiz type is great for foreign language conjugation. You'll be able to define a set of prompts for each question."],
  ["LA", "This quiz is for problem sets that call for longer responses. It is very similar to Short Answer, but provides a larger response space."]
])

export const SINGLE: string[] = ["MC", "SA", "LA"];