import React from 'react';
import { QuizInfo } from '../Quiz/QuizInfo';


export interface FormState {
  questions: any[];
  title: string;
} 

export interface FormProps {
  quizType: string | undefined;
  onBack : () => void;
  submit: (qz: QuizInfo) => void;
  afterSubmit: () => void;
}

export default class Form extends React.Component<FormProps, FormState> {
  
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
      choices: newQs[qNum].choices
    }

    this.setState({questions: newQs});
  }

  onAnswerChange(evt: any, qNum: number) {
    let newQs = this.state.questions.slice();

    newQs[qNum] = {
      prompts: newQs[qNum].prompts,
      answer: evt.target.value,
      choices: newQs[qNum].choices
    }

    this.setState({questions: newQs});
  }

  formSubmission(questions: any[]) {
    this.props.submit(new QuizInfo(this.state.title, this.props.quizType, "UID", questions));

    this.props.onBack();
  }
}