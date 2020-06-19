import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';
import './MultipleChoice.css';

export class MultipleChoice extends QuestionHandler {

    // populate answer choices from question object 
    renderChoices = () => {
        let options = this.props.question.choices.map((item: string) =>
            <FormControlLabel value={item} control={<Radio />} label={item} color ='secondary'/>
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


    shuffle(arr: string[]): string[] {
        let array: string[] = arr.slice();

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    /*
    Format:
    
    Title
    Answer Choices
    */
    render() {
        return (
        <div>
            {this.renderChoices()} <br/>
        </div>);
    }
}

