import React from 'react';
import { TextField, Typography, Box } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';

export class MultiShortAnswers extends QuestionHandler {

    // Saves answer string[] by replacing value at index with event.target.value
    changeAnswer= (event: any, index: number)=>{
        const newAnswers  = (this.props.answer as string[]).slice();
        newAnswers[index] = event.target.value;
        this.props.changeAnswer(newAnswers);
    }

    // Renders prompts and answer box pairs 
    renderQuestions= () =>{
        
        let prompts = this.props.question.prompts; // list of prompts for the question
        let answers = this.props.answer; // list of current answer for display purposes

        // create list of numbers from 0 to size - 1 of prompts
        var list = [];
        for (var i = 0; i< prompts.length; i ++){
            list.push(i);
        }

        // maps index to question answer box pairs
        let questions = list.map((index: number) =>
            <div>
                <TextField
                    rows={1}
                    label={prompts[index]}
                    onChange={e => this.changeAnswer(e, index)}
                    value={answers[index]}
                    style={{minWidth: "300px"}}
                    color='primary'
                    size='small'
                /> 
            </div>
        );
        
        return (
            <div>
                {questions}
            </div>
            
        );

    }

    /*
    Format:
    
    Title
    [(Prompt, Answer Box), ...]
    */
    render() {
        
        return (
        <div>
            <Typography variant="h6" color="primary">
                <Box fontWeight={"fontWeightBold"}>Question {this.props.index}:</Box>
            </Typography>
            <div>
                <Typography variant='body1'>
                    <Box>{this.props.question.title}</Box>
                </Typography>
                {this.renderQuestions()}
            </div> 
        </div>);
    }
}