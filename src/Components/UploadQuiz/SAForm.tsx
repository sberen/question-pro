import React from 'react';
import {TextField, Container, Paper, Typography, Box} from '@material-ui/core';
import Form from './Form';
import './Form.css';


export class SAForm extends Form {
  constructor(props: any) {
    super(props);
    let arr : any[] = [];
    for (let i = 0 ; i < 3; i++) {
      arr.push({
        prompts: "",
        answer: "",
        choices: []
      })
    }
    this.state = {
      questions: arr,
      title: ""
    }
  }
  
  render() {
    let { questions } = this.state;
    
    return (
      <Container component={Paper}>
        <div>
          {this.title()}
          {questions.map((val, ind) => 
            (<div style={{margin: "5%"}}>
              <Typography variant={"h6"} color={"primary"} style={{marginBottom: "10px"}}>
                <Box fontWeight={"fontWeightBold"}>Question {ind + 1}:</Box>
                </Typography>
              <div > 
                <TextField key={ind} 
                           label="Prompt" 
                           onChange={(evt: any) => this.onQuestionChange(evt, ind)} 
                           value={val.prompts} color='primary' 
                           size ='small'
                           style={{minWidth: "300px"}}
                           variant={"outlined"}
                           className="padRight"
                />
                {this.props.quizType === "LA" ? <div/> : <span></span>}
                  <TextField 
                              key={"second" + ind} 
                              style={{minWidth: "300px"}}
                              rows={5} 
                              multiline={this.props.quizType === "LA"} 
                              label="Answer" 
                              onChange={(evt: any) => this.onAnswerChange(evt, ind)} 
                              value={val.answer} 
                              color='primary'
                              size='small'
                              variant="outlined"
                  />
              
              </div>
            </div>)
          )}
          {this.renderButtons()}
        </div>
      </Container>
    )
  }

}