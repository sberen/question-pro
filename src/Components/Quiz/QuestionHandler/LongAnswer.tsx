import React from 'react';
import { TextField, Box, Typography, Grid, Card, CardContent, CardActions } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';

export class LongAnswer extends QuestionHandler {

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
                    <Typography variant='body1' style={{paddingBottom: "10px"}}>
                        {this.props.question.prompts}
                    </Typography>
                </CardContent>
                <CardActions>
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
                </CardActions>
            </Grid>
        )
    }
}