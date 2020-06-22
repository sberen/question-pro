import React from 'react';
import {Button, Grid, Card, CardContent, Typography, CardActions, IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import './QuizSelector.css';
import { QuizInfo } from '../Quiz/QuizInfo';
import { QUIZ_INDICES, QUIZ_TYPES } from '../Quiz/QuizTypes';
import { QuizInfoMini } from '../Quiz/QuizInfoMini';
import { firestore, auth } from '../../firebase';
import firebase from 'firebase/app';

interface SelectorProps {
  changeQuiz(qz : QuizInfo) : void;
  makeQuiz: () => void;
  removeQuiz(id : string) : void;
  quizzes: QuizInfoMini[];
}


export class QuizSelector extends React.Component<SelectorProps, {}> {

  render() {
    const result : any[] = this.props.quizzes.map((quiz:QuizInfoMini, idx:number) => (
        <Grid item component={Card} key={quiz.name} className={"card"} style={{margin: "10px"}} id="button" md={3} xs={12} sm={12}>   
          <CardContent>
            <Typography variant='h6'>{quiz.name}</Typography>
            <Typography variant='body2'>Type: {QUIZ_TYPES[QUIZ_INDICES.get(quiz.type) as number].longName}</Typography>
          </CardContent>
          <CardActions>
            <Button key={idx} onClick={() => this.selectQuiz(quiz.uid)} color='primary' variant='text'>Take Quiz</Button>
            <IconButton aria-label="delete" style={{ color: "#e32636"}} onClick={() => this.removeQuiz(quiz.uid)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Grid>
      ));
    return (<div>
              <Typography style={{margin: "10px"}} variant='h5' color="primary">My Quizzes:</Typography>
            <Grid container spacing={3}>
                {result.length !== 0 ? result : 
                <Grid item component={Card} style={{margin: "10px"}} spacing={3} xs={12} md={3} sm={12}>
                  <CardContent>
                    <Typography variant='h6'>You haven't made any quizzes yet!</Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => this.props.makeQuiz()} color="primary" variant='text'>Create A Quiz</Button>
                  </CardActions>
                </Grid>}
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

  removeQuiz(quiz : string){
    let object = firestore.collection("users").doc(auth.currentUser!.uid);
    var key = `quizzes.${quiz}`;
    object.update({
      [key]: firebase.firestore.FieldValue.delete()
    });
    this.props.removeQuiz(quiz);
  }
}