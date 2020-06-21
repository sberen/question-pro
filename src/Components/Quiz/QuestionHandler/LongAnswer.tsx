import React from 'react';
import { TextField, Box, Typography } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';

export class LongAnswer extends QuestionHandler {

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
            <div>
                <Typography variant='body1' style={{paddingBottom: "10px"}}>
                    {this.props.question.prompts}
                </Typography>
                <TextField
                    onChange={this.onInputChange}
                    value={this.props.answer}
                    color='primary'
                    rows={5}
                    multiline={true}
                    variant={"outlined"}
                    size='small'
                    label={"Answer"}
                    style={{width: "100%"}}
                /> 
            </div>
            </div>
        )
    }
}