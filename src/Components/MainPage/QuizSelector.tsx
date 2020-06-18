import React from 'react';
import {Button, Grid} from '@material-ui/core';
import './QuizSelector.css';
import { QuizInfo } from '../Quiz/QuizInfo';
import { QuizInfoMini } from '../Quiz/QuizInfoMini';
import { firestore } from '../../firebase';

interface SelectorProps {
  changeQuiz(qz : QuizInfo) : void;
  quizzes: QuizInfoMini[];
}


export class QuizSelector extends React.Component<SelectorProps, {}> {

  render() {
    const result : any[] = [];
    for(let quiz of this.props.quizzes) {
      result.push(
        <Grid key={quiz.name} item id="button" spacing={3} xs={12}>
          <Button onClick={() => this.selectQuiz(quiz.uid)} color='primary' variant='outlined'>{quiz.name}</Button>
        </Grid>
      )
    }
    return (<Grid container>
                <h3>My Quizzes:</h3>
                {result}
            </Grid>);
  }

  async selectQuiz(quiz : string){
    let object = await firestore.collection("quizzes").doc(quiz).get();
    let qz = new QuizInfo(object.get("title"), object.get("type"), quiz, object.get("questions"));
    this.props.changeQuiz(qz);
  }
}