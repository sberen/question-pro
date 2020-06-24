import React from 'react';
import {Button, TextField, Grid, Card, CardActions} from '@material-ui/core';
import { firestore } from '../../firebase';
import "./Form.css";
import { QuizInfoMini } from '../Quiz/QuizInfoMini';
import { auth } from '../../firebase';


export interface FormState {
  questions: any[];
  title: string;
} 

export interface FormProps {
  quizType: string | undefined;
  onBack : () => void;
  addQuiz: (qz: QuizInfoMini) => void;
  afterSubmit: () => void;
}

export default class Form extends React.Component<FormProps, FormState> {

  title() {
    return (
            <div id={"title"} style={{marginBottom: "10px"}}>
              <TextField label="Quiz Title" id={"title"} onChange={(evt:any)=> this.setState({title: evt.target.value})}/>;
            </div>
    )
  }

  renderButtons() {
    return (
        <div id={"buttons"}>
          <Button onClick={() => this.addQ()} variant="outlined" color="primary">Add Question</Button>
          <Button onClick={() => this.deleteQ()} variant='outlined' color='primary'>Delete Question</Button>
          <Button onClick={() => this.submit()} variant='outlined' color='primary'>Submit</Button>
          <Button onClick={() => this.props.onBack()} variant='outlined' color='primary'>Back</Button>
        </div>
    )
  }
  
  addQ() {
    this.setState((prevState:FormState) => ({
      questions: [...prevState.questions, {prompts: "", answer: "", questionType: this.props.quizType}]
    }));
  }

  deleteQ() {
    if(this.state.questions.length !== 1) {
      this.setState((prev:FormState) => ({
        questions: prev.questions.slice(0, prev.questions.length - 1)
      }));
    }
  }

  onQuestionChange(evt:any, qNum: number) {
    let newQs: any = this.state.questions.slice();

    newQs[qNum] = {
      prompts: evt.target.value,
      answer: newQs[qNum].answer,
      choices: newQs[qNum].choices,
      questionType: this.props.quizType
    }

    this.setState({questions: newQs});
  }

  onAnswerChange(evt: any, qNum: number) {
    let newQs = this.state.questions.slice();

    console.log(evt);

    newQs[qNum] = {
      prompts: newQs[qNum].prompts,
      answer: evt.target.value,
      choices: newQs[qNum].choices,
      quizType: this.props.quizType
    }

    this.setState({questions: newQs});
  }

  async formSubmission(qs: any[]) {
    var quizID: string = await firestore.collection("quizzes").add({
      questions: qs,
      title: this.state.title,
      type: this.props.quizType,
      author: auth.currentUser!.uid
    }).then((docRef) => {
      this.props.addQuiz(new QuizInfoMini(this.state.title, this.props.quizType, docRef.id));
      return docRef.id;
    });

    var key = `quizzes.${quizID}`;

    firestore.collection("users").doc(auth.currentUser!.uid).update({
      [key] : [this.state.title, this.props.quizType]
    });

    const wrongCnt: number[] = new Array(qs.length).fill(0);

    firestore.collection("users").doc(auth.currentUser!.uid).update({
      [`quizResults.${quizID}.overall.attemptCnt`] : 0,
      [`quizResults.${quizID}.overall.wrongCnt`] : 0,
      [`quizResults.${quizID}.attempts`] :[],
      [`quizResults.${quizID}.wrongQCnt`] :wrongCnt
    });

    this.props.afterSubmit();
  }

  submit() {
    if (this.state.title === "") {
      window.alert("Please title your quiz.");
      return;
    }
    this.formSubmission(this.state.questions);
  }

  topCard() {
    return (
      <Grid item component={Card} xs={12} md={12} sm={12} className={"card"}>
          <CardActions>
            {this.title()}
            <div style={{flexGrow: 1}}/>
            {this.renderButtons()}
          </CardActions>
        </Grid>
    )
  }
}