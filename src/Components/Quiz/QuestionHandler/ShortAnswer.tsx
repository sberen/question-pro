import React from 'react';

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
                <button key="back" onClick={() => {this.props.changeQuestion(-1)}}>Back</button>
            )
        }
        result.push(
            <button key="next" onClick={() => {this.props.changeQuestion(1)}}>
            {secondButton}</button>
        )
        

        return (
        <div>
            {this.props.question.prompt} <br/>
            <textarea
                    rows={1}
                    cols={30}
                    onChange={this.onInputChange}
                    value={this.props.answer}
                /> <br/>
            {result}
        </div>);
    }
}