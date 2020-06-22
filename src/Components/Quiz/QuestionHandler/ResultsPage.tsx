import React from 'react';
import { Button, Card, Grid, Typography, Box, CardContent } from '@material-ui/core';
import { SINGLE } from '../QuizTypes';
import CountUp from 'react-countup';
import {QuizInfo} from '../QuizInfo';
import './ResultsPage.css'


export function Results(quiz: QuizInfo, responses: string[], shrinkQs: (Qs: any[]) => void, onBack: () => any) {
  let display : [any, any[]];
  if(SINGLE.includes(quiz.type)) {
    display = SingleResults(quiz, responses);
  } else {
    display = MultiResults(quiz, responses); 
  }

  let grade : number = Math.round(100 * ((responses.length - display[1].length) / responses.length));
  return (
      <div>
        <Typography variant='h5' className={grade >= 80 ? "correctText" : "incorrectText"}>
         <Box fontWeight={"fontWeightBold"}>Grade: <CountUp start={0} end={grade} duration={2.5}/>%</Box>
        </Typography>
        {display[0]}
        {getButtons(display[1], shrinkQs, onBack)}
      </div>
  )
}


function SingleResults(quiz: QuizInfo, responses: string[]): [any, any[]] {
    const display: any[] = [];
    const incorrect: any[] = [];
    let numCorrect: number = 0;
    for (let i = 1; i <= quiz.questions.length; i++) {
      let correct : boolean = responses[i-1].trim() === quiz.questions[i-1].answer;
      if (correct){
         numCorrect++;
      } else {
        incorrect.push(quiz.questions[i-1]);
      }
      display.push(
        <Grid item component={Card} xs={12} sm={12} md={12} className={correct ? "correctCard" : "incorrectCard"}>
          <CardContent>
            <Typography variant='h6'>
              <Box fontWeight={"fontWeightBold"}>Question {i}: {quiz.questions[i-1].prompts}</Box>
            </Typography>
            <Typography variant='h6' className={correct ? "correctText" : "incorrectText"}>
              <Box fontWeight={"fontWeightBold"}>{correct ? "Correct!" : "Incorrect"}</Box>
            </Typography>
          </CardContent>
          <CardContent>
            <Typography>{`Your Answer: ${responses[i-1]}`}</Typography>
            <Typography>{!correct ? `Correct Answer: ${quiz.questions[i-1].answer}` : 'Correct!'}</Typography>
          </CardContent>
        </Grid>
      )
    }

    

    return [(
          <Grid container spacing={3}>
            {display} 
          </Grid>
    ), incorrect]
  }

  function MultiResults(quiz: QuizInfo, responses: string[]): [any, any[]] {
    const display = [];
    const incorrect = [];
    let numCorrect: number = 0;
    for(let quest = 0; quest < responses.length; quest++) {
      const question: any[] = [];
      const incorrectPrompts: any[] = [];
      let numIncorrectPrompts: number = 0;
      for(let prompt = 0; prompt < responses[quest].length; prompt++) {
        let correct: boolean = quiz.questions[quest].answer[prompt] === responses[quest][prompt];
        if (!correct) {
          numIncorrectPrompts++;
          incorrectPrompts.push(<div>
            {quiz.questions[quest].prompts[prompt]}: {quiz.questions[quest].answer[prompt]}
          </div>)
        }
        question.push(<div>
          {quiz.questions[quest].prompts[prompt]}: {responses[quest][prompt]} 
        </div>);
      } 
      if (numIncorrectPrompts === 0) {
        numCorrect++;
      } else {
        incorrect.push(quiz.questions[quest]);
      }
      display.push(<h5>
        Question {quest+1}: {quiz.questions[quest].title}
        {question}
        {numIncorrectPrompts !== 0 ? <div> <br/> Should Have Been: {incorrectPrompts}</div> : <br/>}
      </h5>)
    }

    return [( 
      <div>
        <h3>Grade: {Math.round(100 * (numCorrect / responses.length))}% </h3>
        {display}
      </div>
    ), incorrect];
  }

  function getButtons(incorrect: any[], shrinkQs: (Qs: any[]) => void, onBack: () => void) {
    const buttons: any[] = [];
    if (incorrect.length !== 0) buttons.push(<Button onClick={() => shrinkQs(incorrect)}  variant="outlined" color="primary">Test Incorrect Answers</Button>)
    buttons.push(<Button onClick={() => onBack()}  variant="outlined" color="primary">Home</Button>);

    return buttons;
  }