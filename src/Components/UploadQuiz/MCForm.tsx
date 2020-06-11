import React from 'react';
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
          {this.title()}
          {questions.map((val, idx) => 
            (<div>
              <h3>Question {idx + 1}:</h3>
              <div id="fields"> 
                <TextField id='fields'key={idx} label="Question" 
                           onChange={(evt: any) => this.onQuestionChange(evt, idx)} 
                           value={val.prompts} 
                           color='primary' 
                           size ='small'
                />
                <Button style={{margin: "1px"}} onClick={() => this.addChoice(idx)} variant="outlined" color="primary">Add Choice</Button>
                <Button style={{margin: "1px"}} onClick={() => this.deleteChoice(idx)} variant="outlined" color="primary">Delete Choice</Button>
              </div>
              <div id="fields">
                <TextField  id='fields' key={"second" + idx} 
                            label="Correct Answer" 
                            onChange={(evt: any) => this.onAnswerChange(evt, idx)} 
                            value={val.answer} 
                            color='primary'
                            variant={"outlined"}
                            size='small'
                />
                {val.choices.map((choice: string, ind: number) => <div>
                                                      <TextField id="choice"
                                                                  label={`Wrong Answer ${ind+1}:`} 
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
          {this.renderButtons()}
        </div>
    )
  }

  addQ() {
    this.setState((prev:FormState) => ({
      questions: [...prev.questions, {prompts: "", answer: "", choices: prev.questions[0].choices.map(() => "")}]
    }))
  }

  addChoice(idx: number) {
    let newQs: any[] = this.state.questions.slice();

    newQs[idx].choices.push("");

    this.setState({
      questions: newQs
    });
  }

  deleteChoice(idx: number) {
    if(this.state.questions[idx].choices.length !== 1) {
      let newQs: any[] = this.state.questions.slice();

      newQs[idx].choices = newQs[idx].choices.slice(0, newQs[idx].answer.length - 1);


      this.setState({
        questions: newQs
      });
    }
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