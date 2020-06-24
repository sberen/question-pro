import React from 'react';
import { TextField, Typography, Box, Grid, Card, CardContent, CardActions } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';


export class ShortAnswer extends QuestionHandler {

    /*
    Format:
    
    Title
    Answer Box
    */
    render() {
        
        return (
        <Grid item component={Card} xs={12} md={12} sm={12} className={"card"}>
            <CardContent> 
                <Typography variant='h6' color='primary'>
                    <Box fontWeight="fontWeightBold">Question {this.props.index}:</Box>
                </Typography>
                <Typography variant='body1'>
                    {this.props.question.prompts}
                </Typography>
            </CardContent>
            <CardActions>
                <TextField
                    rows={1}
                    onChange={this.onInputChange}
                    value={this.props.answer}
                    color='primary'
                    size='small'
                    label={"Answer"}
                    style={{minWidth: "300px"}}
                />
            </CardActions>
        </Grid>);
    }
}