import React from 'react';
import { TextField, Typography, Box, Card, 
        CardActions, Grid, CardContent } from '@material-ui/core';
import Form from './Form';
import './Form.css';
import '../MainPage/QuizSelector.css';


export class LAForm extends Form {
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
              </CardActions>
              <CardActions>
                <TextField 
                            key={"second" + ind} 
                            style={{width: "100%"}}
                            label="Answer" 
                            rows={5}
                            multiline={true}
                            onChange={(evt: any) => this.onAnswerChange(evt, ind)} 
                            value={val.answer} 
                            color='primary'
                            size='small'
                            variant={"outlined"}
                />
              
              </CardActions>
            </Grid>)
          )}
      </Grid>
    );
  }

}