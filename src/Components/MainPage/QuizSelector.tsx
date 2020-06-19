import React from 'react';
import {Button, Grid, Card, CardContent, Typography, CardActions} from '@material-ui/core';
import './QuizSelector.css';
import { QuizInfo } from '../Quiz/QuizInfo';
import { QUIZ_INDICES, QUIZ_TYPES } from '../Quiz/QuizTypes';
import { QuizInfoMini } from '../Quiz/QuizInfoMini';
import { firestore } from '../../firebase';

interface SelectorProps {
  changeQuiz(qz : QuizInfo) : void;
  quizzes: QuizInfoMini[];
}


export class QuizSelector extends React.Component<SelectorProps, {}> {

  render() {
    const result : any[] = this.props.quizzes.map((quiz:QuizInfoMini, idx:number) => (
        <Grid item component={Card} key={quiz.name} style={{margin: "10px"}} id="button" spacing={3} md={3} xs={12} sm={6}>   
          <CardContent>
            <Typography variant='h6'>{quiz.name}</Typography>
            <Typography variant='body2'>Type: {QUIZ_TYPES[QUIZ_INDICES.get(quiz.type) as number].longName}</Typography>
          </CardContent>
          <CardActions>
            <Button key={idx} onClick={() => this.selectQuiz(quiz.uid)} color='primary' variant='text'>Take Quiz</Button>
          </CardActions>
        </Grid>
      ));
    return (<div>
              <Typography style={{margin: "10px"}} variant='h5' color="primary">My Quizzes:</Typography>
            <Grid container spacing={3}>
                {result}
            </Grid>

            </div>
            );
  }

  async selectQuiz(quiz : string){
    console.log(quiz);
    let object = await firestore.collection("quizzes").doc(quiz).get();
    let qz = new QuizInfo(object.get("title"), object.get("type"), quiz, object.get("questions"));
    this.props.changeQuiz(qz);
  }
}