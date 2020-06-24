import React from 'react';
import { QuizInfoMini } from '../Quiz/QuizInfoMini';
import { QUIZ_TYPES, QUIZ_INDICES, QUIZ_DESC } from '../Quiz/QuizTypes';
import { Button, Grid, CardActions, Card, CardContent, Typography, TextField } from '@material-ui/core';
import {FormProps} from './Form';
import "./UploadQuiz.css";
import { MCForm } from './MCForm';
import { SAForm } from './SAForm';
import {MSAForm} from './MSAForm';
import {LAForm} from './LAForm';
import { firestore, auth } from '../../firebase';
import "../MainPage/QuizSelector.css";

interface UploadProps {
  submit: (qz: QuizInfoMini) => void;
  afterSubmit: () => void;
}


interface UploadState {
  quizType: string | undefined;
  quizID: string;
}

export default class UploadQuiz extends React.Component<UploadProps, UploadState> {
  constructor(props: any) {
    super(props);
    this.state = {
      quizType: undefined,
      quizID: ""
    }
  }

  render() {
    const buttons: any[] = QUIZ_TYPES.map((val) => <Grid item component={Card} className={"card"} style={{margin: "5px"}} id="button" xs={12} md ={5}>
                                                      <CardContent>
                                                        <Typography variant="h6">
                                                          {val.longName}
                                                        </Typography>
                                                        <Typography variant='body2'>
                                                          {QUIZ_DESC.get(val.shortName)}
                                                        </Typography>
                                                      </CardContent>
                                                      <CardActions>
                                                        <Button onClick={() => this.setState({quizType: val.shortName})} color='primary' variant='text'>Make This Quiz</Button>
                                                      </CardActions>
                                                    </Grid>);

    const props: FormProps = {
      quizType: this.state.quizType,
      afterSubmit: this.props.afterSubmit,
      addQuiz: this.props.submit,
      onBack: () => this.setState({quizType: undefined})
    }

    const forms: any[] = [
      <SAForm {...props}/>,
      <MCForm {...props}/>,
      <MSAForm {...props}/>,
      <LAForm {...props}/>
    ];

    return ( !this.state.quizType
                    ?  (<div style={{margin: "10px"}}>
                        <Typography style={{margin: "5px"}} variant='h5' color='primary'>New Quiz Type:</Typography>
                        <br/>
                        <Grid container spacing={3} >
                          {buttons}
                        <Grid item className={"card"} style={{marginLeft: "5px"}} component={Card} xs={12} md={5}>
                          <CardContent>
                            <Typography variant='h6'>
                              Add via Quiz ID
                            </Typography>
                            <Typography variant='body2'>
                              Enter the quiz ID that was shared with you, and get back to studying!
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <TextField key={"second"}
                              rows={1}
                              label="QuizID"
                              onChange={(evt: any) => this.setState({quizID: evt.target.value})}
                              value={this.state.quizID}
                              color='primary'
                              size='medium'
                            />
                            <div/>
                            <Button style={{marginTop: "10px"}} onClick={() => this.validateQuiz()} variant="text" color="primary">Add Quiz</Button>
                          </CardActions>
                        </Grid>
                        </Grid>
                      </div>)
                    : <div>
                        <div>
                          <Typography variant={"h5"} color={"primary"}>Make a New {QUIZ_TYPES[QUIZ_INDICES.get(this.state.quizType) as number].longName} Quiz:</Typography>
                        </div>
                      {forms[QUIZ_INDICES.get(this.state.quizType) as number]}
                    </div> );
  }

  async validateQuiz(){
    let quizID = this.state.quizID.trim();
    var quizDocRef: firebase.firestore.DocumentReference = firestore.collection("quizzes").doc(quizID);
    let quiz = await quizDocRef.get()
                            .then(doc => {
                              if (!doc.exists) {
                                window.alert('Please enter valid quizID.');
                                return undefined;
                              } else {
                                console.log('Document data:', doc.data());
                                return doc.data();
                              }
                            })
                            .catch(err => {
                              console.log('Error getting document', err);
                            });
    console.log(quiz);
    if (quiz){
      var userDocRef : firebase.firestore.DocumentReference = firestore.collection("users").doc(auth.currentUser!.uid);
      let userQuizzes = await userDocRef.get()
                                .then((snap: firebase.firestore.DocumentData) => {
                                  return snap.get("quizzes");
                                })
                                .catch(err => {
                                  console.log('Error getting document', err);
                                });

      if(quizID in userQuizzes){
        window.alert('You already have access to quiz');
      } else {
        var key = `quizzes.${quizID}`;
        const wrongCnt: number[] = new Array(quiz.questions.length).fill(0);
        window.alert('You successfully added quiz to your collection!');
        firestore.collection("users").doc(auth.currentUser!.uid).update({
          [key] : [quiz.title, quiz.type],
          [`quizResults.${quizID}.overall.attemptCnt`] : 0,
          [`quizResults.${quizID}.overall.wrongCnt`] : 0,
          [`quizResults.${quizID}.attempts`] :{},
          [`quizResults.${quizID}.wrongQCnt`] :wrongCnt,
          [`quizResults.${quizID}.lastAttempt`] :0
        });

        this.props.submit(new QuizInfoMini(quiz.title, quiz.type, quizID));
      }

    }

  }

}