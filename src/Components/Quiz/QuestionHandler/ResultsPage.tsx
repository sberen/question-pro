import React from 'react';
import { Button, Card, Grid, Typography, Box, CardContent, CardActions } from '@material-ui/core';
import { SINGLE } from '../QuizTypes';
import CountUp from 'react-countup';
import {QuizInfo} from '../QuizInfo';
import './ResultsPage.css'
import { firestore, auth } from '../../../firebase';
import firebase from 'firebase/app';


export function Results(quiz: QuizInfo, responses: string[], shrinkQs: (Qs: any[]) => void, onBack: () => any) {
  let display : [any, any[], number[]];
  if(SINGLE.includes(quiz.type)) {
    display = SingleResults(quiz, responses);
  } else {
    display = MultiResults(quiz, responses);
  }
  console.log("here");

  let grade : number = Math.round(100 * ((responses.length - display[1].length) / responses.length));
  return (
      <Grid container spacing={3}>
        <Grid item component={Card} xs={12} md={12} sm={12} className={grade >= 80 ? "goodTitle" : "badTitle"}>
          <CardContent>
            <Typography variant='h5' className={grade >= 80 ? "correctText" : "incorrectText"}>
            <Box fontWeight={"fontWeightBold"}>Grade: <CountUp start={0} end={grade} duration={2.5}/>%</Box>
            </Typography>
          </CardContent>
          <CardActions>
          {getButtons(display[1], shrinkQs, onBack, quiz, display[2])}
          </CardActions>
        </Grid>
        {display[0]}
      </Grid>
  )
}


function SingleResults(quiz: QuizInfo, responses: string[]): [any, any[], number[]] {
    const display: any[] = [];
    const incorrect: any[] = [];
    const incorrectIndex: number[] = [];
    let numCorrect: number = 0;
    for (let i = 1; i <= quiz.questions.length; i++) {
      let correct : boolean = responses[i-1].trim() === quiz.questions[i-1].answer;
      if (correct){
         numCorrect++;
      } else {
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

  function MultiResults(quiz: QuizInfo, responses: string[]): [any, any[], number[]] {
    const display = [];
    const incorrect = [];
    const incorrectIndex : number[] = [];
    let numCorrect: number = 0;
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

      if (numIncorrectPrompts === 0) {
        numCorrect++;
      } else {
        incorrect.push(quiz.questions[quest]);
        incorrectIndex.push(quest);
      }

      /*display.push(<h5>
        Question {quest+1}: {quiz.questions[quest].title}
        {question}
        {numIncorrectPrompts !== 0 ? <div> <br/> Should Have Been: {incorrectPrompts}</div> : <br/>}
      </h5>);*/


      let numCorrectPrompts: number = responses[quest].length - numIncorrectPrompts;

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

function getButtons(incorrect: any[], shrinkQs: (Qs: any[]) => void, onBack: () => void,
                   quiz: QuizInfo, incorrectIndex: number[]) {
  const buttons: any[] = [];
  if (quiz.uid !== ""){
    buttons.push(
      <Button onClick={() => {shrinkQs(quiz.questions); uploadResults(quiz, incorrectIndex);}}
        variant="outlined" color="primary">Retake the Test</Button>
    );
  }

  if (incorrect.length !== 0) buttons.push(
    <Button onClick={() => {shrinkQs(incorrect); uploadResults(quiz, incorrectIndex);}}
      variant="outlined" color="primary">Test Incorrect Answers</Button>
  );

  buttons.push(<Button onClick={() => {onBack(); uploadResults(quiz, incorrectIndex);}}
    variant="outlined" color="primary">Home</Button>);

  return buttons;
}

function uploadResults(quiz: QuizInfo, incorrectIndex: number[]){
  //firebase.database.ServerValue.TIMESTAMP

  if (quiz.uid !== ""){
    const quizID = quiz.uid;
    firestore.collection("users").doc(auth.currentUser!.uid).update({
      [`quizResults.${quizID}.overall.attemptCnt`] : firebase.firestore.FieldValue.increment(1),
      [`quizResults.${quizID}.overall.wrongCnt`] : firebase.firestore.FieldValue.increment(incorrectIndex.length),
      // [`quizResults.${quizID}.attempts`] :firebase.firestore.FieldValue.arrayUnion({
      //         ['time'] : firebase.firestore.FieldValue.serverTimestamp(),
      //         ['wrongIndices']: incorrectIndex
      //       })
    });
  }

}