import React from 'react';
import Form, {FormState} from './Form';
import {TextField, Button} from '@material-ui/core';

export class MSAForm extends Form {
  constructor(props: any) {
    super(props);

    this.state ={
      questions: [{
        title: "",
        prompts: ["", "", "", ""],
        answer: ["", "", "", ""]
      }], title: ""
    }
  }

  render() {
    let { questions } = this.state;

    return (
      <div>
        {this.title()}
        {questions.map((q: any, idx: number) => (
          <div>
            <h3>Question {idx+1}:</h3>
            <div>
            <TextField id='fields' key={idx} label="Question" 
                           onChange={(evt: any) => this.onQuestionChange(evt, idx)} 
                           value={q.title} 
                           color='primary' 
                           size ='small'
                />
            <Button style={{margin: "1px"}} onClick={() => this.addPrompt(idx)} variant="outlined" color="primary">Add Prompt</Button>
            <Button style={{margin: "1px"}} onClick={() => this.deletePrompt(idx)} variant="outlined" color="primary">Delete Prompt</Button>
            </div>
              {q.prompts.map((prompt: string, ind: number) => (
                <div>
                  <TextField id='fields'key={ind} label="Prompt/Tense" 
                            onChange={(evt: any) => this.onPromptChange(evt, idx, ind)} 
                            value={prompt} 
                            color='primary'
                            style={{margin: "1%"}}
                            variant="outlined"
                            size ='small'
                  />
                  <TextField id='fields'key={`Second ${ind}`} label="Answer" 
                            onChange={(evt: any) => this.onResponseChange(evt, idx, ind)} 
                            value={q.answer[ind]} 
                            color='primary'
                            style={{margin: "1%"}} 
                            variant="outlined"
                            size ='small'
                  />
                </div>
              ))}
          </div>
        ))}
        {this.renderButtons()}
      </div>
    )
  }

  deletePrompt(idx: number) {
    if(this.state.questions[idx].prompts.length !== 1) {
      let newQs: any[] = this.state.questions.slice();

      newQs[idx].answer = newQs[idx].answer.slice(0, newQs[idx].answer.length - 1);
      newQs[idx].prompts = newQs[idx].prompts.slice(0, newQs[idx].prompts.length - 1);


      this.setState({
        questions: newQs
      });
    }
  }

  addPrompt(idx: number) {
    let newQs: any[] = this.state.questions.slice();
    
    newQs[idx].prompts.push("");
    newQs[idx].answer.push("");
    
    this.setState({
      questions: newQs
    });
  }

  addQ() {
    this.setState((prevState: FormState) => ({
      questions: [...prevState.questions, {
                                          title: "", 
                                          prompts: prevState.questions[0].prompts.slice(), 
                                          answer: prevState.questions[0].prompts.map(() => "")
                                        }]
    }));
  }

  onQuestionChange(evt: any, idx: number) {
    let newQs: any[] = this.state.questions.slice();

    newQs[idx] = {
      title: evt.target.value,
      prompts: newQs[idx].prompts,
      answer: newQs[idx].answer,
    }

    this.setState({questions: newQs});
  }

  onPromptChange(evt: any, qNum: number, pNum: number) {
    let newQs: any[] = this.state.questions.slice();
    let newPrompts: string[] = newQs[qNum].prompts.slice();

    newPrompts[pNum] = evt.target.value;

    newQs[qNum] = {
      title: newQs[qNum].title,
      prompts: newPrompts,
      answer: newQs[qNum].answer
    }

    this.setState({questions: newQs});
  }

  onResponseChange(evt: any, qNum: number, pNum: number) {
    let newQs: any[] = this.state.questions.slice();
    let newAns: string[] = newQs[qNum].answer.slice();

    newAns[pNum] = evt.target.value;

    newQs[qNum] ={
      title: newQs[qNum].title,
      prompts: newQs[qNum].prompts,
      answer: newAns
    }

    this.setState({questions: newQs});
  }
}