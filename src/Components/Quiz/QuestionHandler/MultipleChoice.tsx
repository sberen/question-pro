import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';
import './MultipleChoice.css';

export class MultipleChoice extends QuestionHandler {

    // populate answer choices from question object 
    renderChoices = () => {
        let options = this.props.question.choices.map((item: string) =>
            <FormControlLabel value={item} control={<Radio />} label={item} color ='primary'/>
        );
        return (
            <div>
            <Typography variant='h5' color='primary'>
                <Box fontWeight={"fontWeightBold"}>Question {this.props.index}:</Box>
            </Typography>
            <Typography variant='h6'>
                    <Box>{this.props.question.prompts}</Box>
            </Typography>
            <FormControl component="fieldset" style={{paddingLeft: "3%"}}>
                <RadioGroup aria-label="question" name="question1" value={this.props.answer} onChange={this.onInputChange} style={{marginLeft: "10px"}}>
                    {options}
                </RadioGroup>
            </FormControl>
            </div>
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
        <div style={{margin: "10px"}}>
            {this.renderChoices()}
        </div>);
    }
}

