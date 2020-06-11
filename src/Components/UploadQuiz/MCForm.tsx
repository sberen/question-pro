import React from 'react';
import { QuizInfo } from '../Quiz/QuizInfo';
import Form, {FormState} from './Form';
import {TextField, Button} from '@material-ui/core';


export class MCForm extends Form {
  constructor(props: any) {
    super(props);
    this.state = {
      questions: [
        {
          prompts: "",
          answer: "",
          choices: ["", ""]
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
          {questions.map((val, idx) => 
            (<div>
              <h3>Question {idx + 1}:</h3>
              <div id="fields"> 
                <TextField id='fields'key={idx} label="Prompt" 
                           onChange={(evt: any) => this.onQuestionChange(evt, idx)} 
                           value={val.prompts} 
                           color='primary' 
                           size ='small'
                />
              </div>
              <div id="fields">
                <TextField  id='fields' key={"second" + idx} 
                            label="Answer" 
                            onChange={(evt: any) => this.onAnswerChange(evt, idx)} 
                            value={val.answer} 
                            color='primary'
                            variant={"outlined"}
                            size='small'
                />
                {val.choices.map((choice: string, ind: number) => <div>
                                                      <TextField id="choice"
                                                                  label={`Choice ${ind}:`} 
                                                                  onChange={(evt:any) => this.onChoiceChange(evt, idx, ind)} 
                                                                  value={choice} 
                                                                  color='primary'
                                                                  variant='outlined'
                                                                  size='small' 
                                                        />
                                                  </div>)
                }
              </div>
            </div>)
          )}
          <Button onClick={() => this.addQ()} variant="outlined" color="primary">Add</Button>
          <Button onClick={() => this.deleteQ()} variant='outlined' color='primary'>Delete</Button>
          <Button onClick={() => this.submit()} variant='outlined' color='primary'>Submit</Button>
          <Button onClick={() => this.props.onBack()} variant='outlined' color='primary'>Back</Button>
        </div>
    )
  }

  addQ() {
    this.setState((prev:FormState) => ({
      questions: [...prev.questions, {prompts: "", answer: "", choices: ["", ""]}]
    }))
  }

  submit() {
    if (this.state.title === "") {
      window.alert("Please title your quiz.");
      return;
    }

    let newQs: any[] = this.state.questions.slice();

    newQs.forEach((val) => val.choices.push(val.answer));

    this.formSubmission(newQs);
  }

  onChoiceChange(evt: any, qNum: number, cNum: number) {
    let newQs: any = this.state.questions.slice();
    let newChoices: any = newQs[qNum].choices.slice();

    newChoices[cNum] = evt.target.value;

    newQs[qNum] = {
      prompts: newQs[qNum].prompts,
      answer: newQs[qNum].answer,
      choices: newChoices
    }

    this.setState({questions: newQs})
  }
}