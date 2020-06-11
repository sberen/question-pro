import React from 'react';
import {TextField, Button} from '@material-ui/core';
import { QuizInfo } from '../Quiz/QuizInfo';
import Form from './Form';


export default class SAForm extends Form {
  constructor(props: any) {
    super(props);
    this.state = {
      questions: [
        {
          prompts: "",
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
              <TextField id='fields'key={ind} label="Prompt" onChange={(evt: any) => this.onQuestionChange(evt, ind)} value={val.prompts} color='primary' size ='small'/>
            </div>
            <div id="fields">
              <TextField  id='fields' key={"second" + ind} 
                          rows={5} 
                          multiline={this.props.quizType === "LA"} 
                          label="Answer" 
                          onChange={(evt: any) => this.onAnswerChange(evt, ind)} 
                          value={val.answer} 
                          color='primary'
                          variant={"outlined"}
                          size='small'
              />
            </div>
          </div>)
        )}
        <Button onClick={() => this.addQ()} variant="outlined" color="primary">Add</Button>
        <Button onClick={() => this.deleteQ()} variant='outlined' color='primary'>Delete</Button>
        <Button onClick={() => this.submit()} variant='outlined' color='primary'>Submit</Button>
      </div>
    )
  }


  submit() {
    if (this.state.title === "") {
      window.alert("Please title your quiz.");
      return;
    }
    this.formSubmission(this.state.questions);
  }
}