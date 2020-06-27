interface Quiz {
  longName: string;
  shortName: string;
}

// An array of information for each
// type of quiz.
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

// the indices map for the display arrays that correspond
// to each quiz type.
export const QUIZ_INDICES: Map<string,number> = new Map<string,number>([
  ["SA", 0],
  ["MC", 1],
  ["MSA", 2],
  ["LA", 3]
])

// map from quiz type, to the description of that quiz type.
export const QUIZ_DESC: Map<string,string> = new Map<string,string>([
  ["SA", "This quiz is great for vocabulary testing, with a single prompt and an open ended response field."],
  ["MC", "This is your classic multiple choice quiz, with one question and a series of answer choices to choose from."],
  ["MSA", "This quiz type is great for foreign language conjugation. You'll be able to define a set of prompts for each question."],
  ["LA", "This quiz is for problems that call for longer responses. It's similar to Short Answer, but allows for larger responses."]
])

// An array of the quiz types that have a single answer per
// question.
export const SINGLE: string[] = ["MC", "SA", "LA"];