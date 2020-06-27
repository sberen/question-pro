import { auth, firestore } from "../../firebase";
import { QuizInfo } from "./QuizInfo";
import { Grid, Card, CardContent, Typography, Box } from "@material-ui/core";
import React from "react";
import { SINGLE } from "./QuizTypes";
import firebase from 'firebase/app';

// this class represents the necessary information
// to grade, display and update the db with the results of a single 
// quiz.
export class QuizResult {
  display: any;
  incorrectQuestions: any;
  incorrectIndices: number[];


  constructor(quiz: QuizInfo, responses: string[], user: any) {

    let info : [any, any[], number[]];
    if(SINGLE.includes(quiz.type)) {
      info = SingleResults(quiz, responses);
    } else {
      info = MultiResults(quiz, responses);
    }
    console.log(quiz);
    uploadResults(quiz, user, info[2]);

    this.display = info[0];
    this.incorrectQuestions = info[1];
    this.incorrectIndices = info[2];
  }

  // Static factory that should be used primarily for creation.
  static async build(quiz: QuizInfo, responses: string[]){
    let user = await firestore.collection("users").doc(auth.currentUser!.uid).get();
    return new QuizResult(quiz, responses, user);
  }

}

// grades a quiz that has only one answer per question (ie. SA, MC, LA) and returns
// the display, an array of the incorrect questions, and an array of the incorrect
// question indices.
function SingleResults(quiz: QuizInfo, responses: string[]): [any, any[], number[]] {
  const display: any[] = [];
  const incorrect: any[] = [];
  const incorrectIndex: number[] = [];
  for (let i = 1; i <= quiz.questions.length; i++) {
    let correct : boolean = responses[i-1].trim() === quiz.questions[i-1].answer;
    if (!correct) {
      incorrect.push(quiz.questions[i-1]);
      incorrectIndex.push(i-1);
    }
    display.push(
      <Grid item component={Card} xs={12} sm={12} md={12} className={correct ? "correctCard" : "incorrectCard"}>
        <CardContent>
          <Typography variant='h6' color={"primary"}>
            <Box fontWeight={"fontWeightBold"}>Question {i}: {quiz.questions[i-1].prompts}</Box>
          </Typography>
          <Typography variant='h6' className={correct ? "correctText" : "incorrectText"}>
            <Box fontWeight={"fontWeightBold"}>{correct ? "Correct!" : "Incorrect"}</Box>
          </Typography>
        </CardContent>
        <CardContent>
          <Typography>{`Your Answer: ${responses[i-1]}`}</Typography>
          <Typography className="correctText">
            {!correct ? `Correct Answer: ${quiz.questions[i-1].answer}` : 'Correct!'}
          </Typography>
        </CardContent>
      </Grid>
    )
  }

  return [display , incorrect, incorrectIndex];
}

// grades a quiz that has multiple answers per question (ie. MSA) and returns
// the display, an array of the incorrect questions, and an array of the incorrect
// question indices.
function MultiResults(quiz: QuizInfo, responses: string[]): [any, any[], number[]] {
  const display = [];
  const incorrect = [];
  const incorrectIndex : number[] = [];
  
  for(let quest = 0; quest < responses.length; quest++) {
    const question: any[] = [];
    const incorrectPrompts: any[] = [];
    let numIncorrectPrompts: number = 0;
    for(let prompt = 0; prompt < responses[quest].length; prompt++) {
      let correct: boolean = quiz.questions[quest].answer[prompt] === responses[quest][prompt];
      if (!correct) {
        numIncorrectPrompts++;
        incorrectPrompts.push(<Box>
          {quiz.questions[quest].prompts[prompt]}: {quiz.questions[quest].answer[prompt]}
        </Box>);
      }

      question.push(<Box>
        {quiz.questions[quest].prompts[prompt]}: {responses[quest][prompt]}
      </Box>);

    }

    if (numIncorrectPrompts !== 0) {
      incorrect.push(quiz.questions[quest]);
      incorrectIndex.push(quest);
    }

    let numCorrectPrompts: number = responses[quest].length - numIncorrectPrompts;

    console.log(quest);
    console.log(quiz.questions[quest])
    display.push(
      <Grid item component={Card} xs={12} sm={12} md={12} className={numIncorrectPrompts === 0  ? "correctCard" : "incorrectCard"}>
        <CardContent>
          <Typography variant='h6' color={"primary"}>
            <Box fontWeight={"fontWeightBold"}>Question {quest+1}: {quiz.questions[quest].title}</Box>
          </Typography>
          <Typography variant='h6' className={numIncorrectPrompts === 0 ? "correctText" : "incorrectText"}>
            <Box fontWeight={"fontWeightBold"}>
              {numIncorrectPrompts === 0 ? "Correct!" : `Incorrect: ${numCorrectPrompts}/${responses[quest].length} Prompts Correct`}
            </Box>
          </Typography>
        </CardContent>
        <CardContent>
          <Typography className= {numIncorrectPrompts === 0 ? "correctText" : "incorrectText"}>
            <Box fontWeight={"fontWeightBold"}>Your Answer:</Box>
          </Typography>
          <Typography style={{marginLeft: "4%"}} className={numIncorrectPrompts === 0 ? "correctText" : "incorrectText"}>
            {question}
          </Typography>
          </CardContent>
          <CardContent>
          <Typography className={"correctText"}>
            <Box fontWeight={"fontWeightBold"}>{numIncorrectPrompts !== 0 ? `Correct Answer:` : 'Correct!'}</Box>
          </Typography>
          {numIncorrectPrompts !== 0 ? <Typography className={"correctText"} style={{marginLeft: "4%"}}>{incorrectPrompts}</Typography> : <span></span>}
        </CardContent>
      </Grid>
    );

  }
  return [display, incorrect, incorrectIndex];
}

// updates the results of the quiz to the database, and inputs all of the 
// statistics necessary
function uploadResults(quiz: QuizInfo, user: any, incorrectIndex :number[]) {
  let usersQuiz: string = 'quizResults.' + quiz.uid;
  let lastAttempt = user.get(usersQuiz + '.lastAttempt');
  let wrongQCnt = user.get(usersQuiz + '.wrongQCnt');
  
  if (quiz.uid !== ""){
    let cur = (lastAttempt >=4) ? 0: lastAttempt +1;
    let curQCnt = wrongQCnt;
    for (let i = 0; i < incorrectIndex.length; i++){
      curQCnt[incorrectIndex[i]] += 1;
    }
    const quizID = quiz.uid;
    firestore.collection("users").doc(auth.currentUser!.uid).update({
      [`quizResults.${quizID}.overall.attemptCnt`] : firebase.firestore.FieldValue.increment(1),
      [`quizResults.${quizID}.overall.wrongCnt`] : firebase.firestore.FieldValue.increment(incorrectIndex.length),
      [`quizResults.${quizID}.lastAttempt`] :cur,
      [`quizResults.${quizID}.attempts.` + cur.toString()] :{
        time : firebase.firestore.FieldValue.serverTimestamp(),
        incorrectIndex : incorrectIndex
      },
      [`quizResults.${quizID}.wrongQCnt`] :curQCnt
    });
  }
}