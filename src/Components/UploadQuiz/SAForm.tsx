import React from 'react';
import {TextField} from '@material-ui/core';
import Form from './Form';


export class SAForm extends Form {
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
        {this.title()}
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
        {this.renderButtons()}
      </div>
    )
  }

}