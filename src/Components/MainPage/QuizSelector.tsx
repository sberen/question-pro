import React from 'react';
import {Button, Grid} from '@material-ui/core';
import './QuizSelector.css';
import { QuizInfo } from '../Quiz/QuizInfo';

interface SelectorProps {
  changeQuiz(qz : QuizInfo) : void;
  quizzes: QuizInfo[];
}


export class QuizSelector extends React.Component<SelectorProps, {}> {

  render() {
    const result : any[] = [];
    for(let quiz of this.props.quizzes) {
      result.push(
        <Grid item id="button" spacing={3} xs={12}>
          <Button onClick={() => this.props.changeQuiz(quiz)} color='primary' variant='outlined'>{quiz.name}</Button>
        </Grid>
      )
    }
    return (<Grid container>
                <h3>Quizzes:</h3>
                {result}
            </Grid>);
  }
}