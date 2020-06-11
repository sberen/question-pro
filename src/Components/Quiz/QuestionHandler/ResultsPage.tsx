import React from 'react';
import { Button } from '@material-ui/core';


export function SingleResults(questions: any[], responses: string[], shrinkQs: (Qs: any[]) => void, onBack: () => any) {
    const display: any[] = [];
    const incorrect: any[] = [];
    let numCorrect: number = 0;
    for (let i = 1; i <= questions.length; i++) {
      let correct : boolean = responses[i-1].trim() === questions[i-1].answer;
      if (correct){
         numCorrect++;
      } else {
        incorrect.push(questions[i-1]);
      }
      display.push(
        <h5>
          Question {i}: {questions[i-1].prompts} <br />
          &ensp;{`Your Answer: ${responses[i-1]}`} <br/>
          &ensp;{!correct ? `Correct Answer: ${questions[i-1].answer}` : 'Correct!'} <br/>
          <br/>
        </h5>
      )
    }

    const buttons: any[] = [];
    if (incorrect.length !== 0) buttons.push(<Button onClick={() => shrinkQs(incorrect)}  variant="outlined" color="primary">Test Incorrect Answers</Button>)
    buttons.push(<Button onClick={() => onBack()}  variant="outlined" color="primary">Home</Button>);

    return (
      <div>
        <h3>Grade: {Math.round(100 * (numCorrect / responses.length))}%</h3>
        {display}
        {buttons} 
      </div>
    )
  }

  export function MultiResults(questions: any[], responses: string[], shrinkQs: (Qs: any[]) => void, onBack: () => any) {
    const display = [];
    const incorrect = [];
    let numCorrect: number = 0;
    for(let quest = 0; quest < responses.length; quest++) {
      const question: any[] = [];
      const incorrectPrompts: any[] = [];
      let numIncorrectPrompts: number = 0;
      for(let prompt = 0; prompt < responses[quest].length; prompt++) {
        let correct: boolean = questions[quest].answer[prompt] == responses[quest][prompt];
        if (!correct) {
          numIncorrectPrompts++;
          incorrectPrompts.push(<div>
            {questions[quest].prompts[prompt]}: {questions[quest].answer[prompt]}
          </div>)
        }
        question.push(<div>
          {questions[quest].prompts[prompt]}: {responses[quest][prompt]} 
        </div>);
      } 
      if (numIncorrectPrompts === 0) {
        numCorrect++;
      } else {
        incorrect.push(questions[quest]);
      }
      display.push(<h5>
        Question {quest+1}: {questions[quest].title}
        {question}
        {numIncorrectPrompts !== 0 ? <div> <br/> Should Have Been: {incorrectPrompts}</div> : <br/>}
      </h5>)
    }

    return ( 

      <div>
        {display}
      </div>
    )
  }