import React from 'react';
import Form, {FormState} from './Form';
import {TextField, Button, Container, Paper, Box, Typography, MenuItem} from '@material-ui/core';


export class MCForm extends Form {
  constructor(props: any) {
    super(props);
    this.state = {
      questions: [
        {
          prompts: "",
          answer: "",
          choices: ["", "", ""]
        }
      ], 
      title: ""
    }
  }

  render() {
    let { questions } = this.state;

    return (
          <Container component={Paper}>
            <div>
            {this.title()}
            </div>
            {questions.map((val, idx) => 
              (<div style={{margin: "5%"}}>
              <div>
                <Typography color="primary" variant={"h6"}>
                  <Box fontWeight={"fontWeightBold"}>Question {idx + 1}:</Box>
                </Typography>
                <div> 
                  <TextField id='fields'key={idx} label="Question" 
                            onChange={(evt: any) => this.onQuestionChange(evt, idx)} 
                            value={val.prompts} 
                            color='primary' 
                            size ='small'
                  />
                  <Button style={{margin: "5px"}} onClick={() => this.addChoice(idx)} variant="outlined" color="primary">Add Choice</Button>
                  <Button style={{margin: "5px"}} onClick={() => this.deleteChoice(idx)} variant="outlined" color="primary">Delete Choice</Button>
                </div>
                <div>
                  {val.choices.map((choice: string, ind: number) => 
                                                    (    <div style={{margin: "5px"}}>
                                                          <TextField id="choice"
                                                                      label={`Choice ${ind+1}:`} 
                                                                      onChange={(evt:any) => this.onChoiceChange(evt, idx, ind)} 
                                                                      value={choice} 
                                                                      color='primary'
                                                                      variant='outlined'
                                                                      size='small' 
                                                            />
                                                        </div> )
                                                    )
                  }
                  <TextField label={"Correct Answer"}
                            onChange={(evt) => this.onAnswerChange(evt, idx)}
                            color={"primary"}
                            value={this.state.questions[idx].answer}
                            style={{minWidth: "150px"}}
                            select>
                              {this.state.questions[idx].choices.map((option:string, num:number) => <MenuItem value={this.state.questions[idx].choices[num]}>{`Choice ${num+1}`}</MenuItem>)}
                  </TextField>
                </div>
              </div>
            </div>)
            )}
            {this.renderButtons()}
          </Container>
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