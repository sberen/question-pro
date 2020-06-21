import React from 'react';
import { TextField, Typography, Box, FormLabel } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';

export class ShortAnswer extends QuestionHandler {

    /*
    Format:
    
    Title
    Answer Box
    */
    render() {
        
        return (
        <div style={{margin: "10px"}}>
            <Typography variant='h6' color='primary'>
                <Box fontWeight="fontWeightBold">Question {this.props.index}:</Box>
            </Typography>
            <div style={{paddingTop: "5px"}}>
                <Typography variant='body1'>
                    {this.props.question.prompts}
                </Typography>
                <TextField
                    rows={1}
                    onChange={this.onInputChange}
                    value={this.props.answer}
                    color='primary'
                    size='small'
                    label={"Answer"}
                    style={{minWidth: "300px"}}
                /> 
            </div>
        </div>);
    }
}