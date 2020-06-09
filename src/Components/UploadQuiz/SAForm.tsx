import React from 'react';
import {TextField, Button} from '@material-ui/core';

interface Question {
  prompt: string;
  answer: string;
}

interface FormState {
  questions: Question[];
  title: string;
}

export default class SAForm extends React.Component<{}, FormState> {
  constructor(props: any) {
    super(props);
    this.state = {
      questions: [
        {
          prompt: "",
          answer: ""
        }
      ],
      title: ""
    }
  }
  render() {
    let { questions } = this.state;
    
    return (
      <div>
        <TextField label="Quiz Title" onChange={(evt:any)=> this.setState({title: evt.target.value})}/>
        {questions.map((val, ind) => 
          (<div>
            <h3>Question {ind + 1}:</h3>
            <div id="fields"> 
              <TextField id="fields" label="Prompt" onChange={(evt: any) => this.onQuestionChange(evt, ind)} value={val.prompt} color='primary' size ='small'/>
            </div>
            <div id="fields">
              <TextField id="fields" label="Answer" onChange={(evt: any) => this.onAnswerChange(evt, ind)} value={val.answer} color='primary' size='small'/>
            </div>
          </div>)
        )}
        <Button onClick={() => this.addQ()} variant="outlined" color="primary">Add</Button>
        <Button onClick={() => this.deleteQ()} variant='outlined' color='primary'>Delete</Button>
        <Button onClick={() => this.writeQs()} variant='outlined' color='primary'>Submit</Button>
      </div>
    )
  }

  deleteQ() {
    if(this.state.questions.length !== 1) {
      this.setState((prev:FormState) => ({
        questions: prev.questions.slice(0, prev.questions.length - 1)
      }));
    }
  }

  onQuestionChange(evt:any, idx: number) {
    const newQs: Question[] = [];
    for(let i = 0; i < this.state.questions.length; i++) {
      let question: Question = this.state.questions[i];
      if (i === idx) {
        question = {
          prompt: evt.target.value,
          answer: question.answer
        }
      }
      newQs.push(question);
    }
    this.setState({questions: newQs});
  }

  addQ() {
    this.setState((prev:FormState) => ({
      questions: [...prev.questions, {prompt: "", answer: ""}]
    }))
  }

  onAnswerChange(evt: any, idx: number) {
    const newAs: Question[] = [];
    for(let i = 0; i < this.state.questions.length; i++) {
      let question: Question = this.state.questions[i];
      if (i === idx) {
        question = {
          answer: evt.target.value,
          prompt: question.prompt
        }
      }
      newAs.push(question);
    }
    this.setState({questions: newAs});
  }

  writeQs() {
    console.log("Submit");
  }
}