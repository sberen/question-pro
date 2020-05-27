import { QuizInfo } from "./MainPage/QuizInfo";

var mc = new QuizInfo('Multiple Choice Example', "Multiple Choice", "00000001");
var vocab = new QuizInfo('Vocabulary Example', "Short Answer", "00000002");
var conj = new QuizInfo('Conjugation Example', "Multiple Short Answer", "00000003");
var trans = new QuizInfo('Translation Example', "Long Answer", "00000004");
export const QUIZZES = [mc, vocab, conj, trans];
