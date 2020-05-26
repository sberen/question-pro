import React from 'react';
import {Button, Grid} from '@material-ui/core';
import './QuizSelector.css';
import {QUIZZES} from '../QuizTypes';

interface SelectorProps {
  changeQuiz: (qz : string) => any;
}


export class QuizSelector extends React.Component<SelectorProps, {}> {

  render() {
    const result : any[] = [];
    for(let quiz of QUIZZES) {
      result.push(
        <Grid item id="button" spacing={3} xs={12}>
          <Button onClick={() => this.props.changeQuiz(quiz)} color='primary' variant='outlined'>{quiz}</Button>
        </Grid>
      )
    }
    return <Grid container>{result}</Grid>;
  }
}