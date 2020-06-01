import React from 'react';
import { Button, TextField } from '@material-ui/core';

interface QuestionProps {
    question: any,
    changeAnswer(ans: string): void,
    changeQuestion(num: number): void,
    isFirst: boolean,
    isLast: boolean,
    answer: string
}


export class ShortAnswer extends React.Component<QuestionProps, {}> {
    
    onInputChange = (event: any) => {
        this.props.changeAnswer(event.target.value);
    }

    render() {
        const result : any[] = []
        var secondButton:String;
        if(this.props.isLast){
            secondButton = "Finish"
        } else{
            secondButton = "Next"
        }
        if (!this.props.isFirst){
            result.push(
                <Button key='back' onClick={() => this.props.changeQuestion(-1)} variant='outlined' color='primary'>Back</Button>
            )
        }
        result.push(
            <Button key="next" onClick={() => {this.props.changeQuestion(1)}} variant='outlined' color='primary'>
            {secondButton}</Button>
        )
        

        return (
        <div>
            {this.props.question.prompt} <br/>
            <TextField
                    rows={1}
                    onChange={this.onInputChange}
                    value={this.props.answer}
                    variant='outlined'
                    color='primary'
                    size='small'
                /> <br/>
            {result}
        </div>);
    }
}