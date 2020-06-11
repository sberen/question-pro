import React from 'react';
import { Button } from '@material-ui/core';

export interface QuestionProps {
    question: any,  // question object with fields dependent on type of quiz
    changeAnswer(ans: string | string[]): void,  // set answer to ans
    changeQuestion(num: number): void, // change question number by num
    isFirst: boolean, // true if its the first question
    isLast: boolean, // true if its the last question
    answer: string | string[] // current answer used to be displayed
}


export class QuestionHandler extends React.Component<QuestionProps, {}> {
    
    // change answer to reflect given target value for given event
    onInputChange = (event: any) => {
        this.props.changeAnswer(event.target.value);
    }

    // renders set of Next, Back, and/ or Finish buttons 
    renderButtons = () =>{
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
        return result;

    }

    render() {
        let result = this.renderButtons;

        return (
        <div>
            {result}
        </div>);
    }
}