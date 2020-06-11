import React from 'react';

export interface QuestionProps {
    question: any,  // question object with fields dependent on type of quiz
    changeAnswer(ans: string | string[]): void,  // set answer to ans
    answer: string | string[] // current answer used to be displayed
}


export class QuestionHandler extends React.Component<QuestionProps, {}> {
    
    // change answer to reflect given target value for given event
    onInputChange = (event: any) => {
        this.props.changeAnswer(event.target.value);
    }

    render() {

        return (
        <div>
        </div>);
    }
}