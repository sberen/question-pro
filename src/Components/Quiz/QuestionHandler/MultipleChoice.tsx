import React from 'react';
import { Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';

export class MultipleChoice extends QuestionHandler {

    renderChoices = () => {

        let options = this.props.question.choices.map((item: string) =>
            <FormControlLabel value={item} control={<Radio />} label={item} />
        );
        return (
            <FormControl component="fieldset">
                <FormLabel component="legend">{this.props.question.prompts}</FormLabel>
                <RadioGroup aria-label="question" name="question1" value={this.props.answer} onChange={this.onInputChange}>
                    {options}
                </RadioGroup>
            </FormControl>
        );
    }
    render() {
        let result = this.renderButtons();
        
        return (
        <div>
            {this.renderChoices()} <br/>
            {result}
        </div>);
    }
}