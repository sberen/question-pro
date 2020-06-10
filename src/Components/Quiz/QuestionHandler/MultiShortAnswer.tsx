import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';

let id = 0;

export class MultiShortAnswers extends QuestionHandler {

    changeAnswer= (event: any, index: number)=>{
        const newAnswers  = (this.props.answer as string[]).slice();
        newAnswers[index] = event.target.value;
        this.props.changeAnswer(newAnswers);

    }

    
    renderQuestions= () =>{
        
        let prompts = this.props.question.prompts;
        let answers = this.props.answer;
        var list = [];
        for (var i = 0; i< prompts.length; i ++){
            list.push(i);
        }

        let questions = list.map((index: number) =>
            <div>
                {prompts[index]} <br/>
                <TextField
                    rows={1}
                    onChange={e => this.changeAnswer(e, index)}
                    value={answers[index]}
                    variant='outlined'
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
    render() {
        let result = this.renderButtons();
        
        return (
        <div>
            {this.props.question.title} <br/>
            {this.renderQuestions()} <br/>
            {result}
        </div>);
    }
}