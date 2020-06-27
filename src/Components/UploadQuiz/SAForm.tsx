import React from 'react';
import {TextField, Grid, Card, CardContent, CardActions, Typography, Box} from '@material-ui/core';
import Form from './Form';
import './Form.css';
import '../MainPage/QuizSelector.css'

// the form for a single Short Answer upload form
export class SAForm extends Form {
  constructor(props: any) {
    super(props);
    let arr : any[] = [];
    for (let i = 0 ; i < 3; i++) {
      arr.push({
        prompts: "",
        answer: "",
        choices: [],
        questionType: "SA"
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
      <Grid container spacing={3}>
        {this.topCard()}
          {questions.map((val, ind) => 
            (<Grid item component={Card} className={"card"} xs={12} sm={12} md={12}>
              <CardContent>
                <Typography variant={"h6"} color={"primary"}>
                  <Box fontWeight={"fontWeightBold"}>Question {ind + 1}:</Box>
                </Typography>
              </CardContent>
              <CardActions > 
                <TextField key={ind} 
                           label="Prompt" 
                           onChange={(evt: any) => this.onQuestionChange(evt, ind)} 
                           value={val.prompts} color='primary' 
                           size ='small'
                           style={{minWidth: "400px"}}
                           className="padded"
                />
                <TextField 
                            key={"second" + ind} 
                            style={{minWidth: "400px"}}
                            label="Answer" 
                            onChange={(evt: any) => this.onAnswerChange(evt, ind)} 
                            value={val.answer} 
                            color='primary'
                            size='small'
                            
                />
              
              </CardActions>
            </Grid>)
          )}
      </Grid>
    );
  }

}