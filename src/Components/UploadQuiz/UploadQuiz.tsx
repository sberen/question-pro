import React from 'react';
import { QuizInfoMini } from '../Quiz/QuizInfoMini';
import { QUIZ_TYPES, QUIZ_INDICES, QUIZ_DESC } from '../Quiz/QuizTypes';
import { Button, Grid, CardActions, Card, CardContent, Typography } from '@material-ui/core';
import {FormProps} from './Form';
import "./UploadQuiz.css";
import { MCForm } from './MCForm';
import { SAForm } from './SAForm';
import {MSAForm} from './MSAForm';

interface UploadProps {
  submit: (qz: QuizInfoMini) => void;
  afterSubmit: () => void;
}


interface UploadState {
  quizType: string | undefined;
}

export default class UploadQuiz extends React.Component<UploadProps, UploadState> {
  constructor(props: any) {
    super(props);
    this.state = {
      quizType: undefined
    }
  }

  render() {
    const buttons: any[] = QUIZ_TYPES.map((val) => <Grid item component={Card} id="button" spacing={3} xs={12}>
                                                      <CardContent>
                                                        <Typography variant="h6">
                                                          {val.longName}
                                                        </Typography>
                                                        <Typography variant='body2'>
                                                          {QUIZ_DESC.get(val.shortName)}
                                                        </Typography>
                                                      </CardContent>
                                                      <CardActions>
                                                        <Button onClick={() => this.setState({quizType: val.shortName})} color='primary' variant='text'>Make This Quiz</Button>
                                                      </CardActions>
                                                    </Grid>);

    const props: FormProps = {
      quizType: this.state.quizType, 
      afterSubmit: this.props.afterSubmit,
      addQuiz: this.props.submit,
      onBack: () => this.setState({quizType: undefined})
    }

    const forms: any[] = [
      <SAForm {...props}/>,
      <MCForm {...props}/>,
      <MSAForm {...props}/>,
      <SAForm {...props}/>
    ];
    
    return ( !this.state.quizType
                    ?  <div style={{margin: "10px"}}>
                        <Typography variant='h5' color='primary'>New Quiz Type:</Typography> 
                        <Grid container xs={12}>
                          {buttons}
                        </Grid>
                      </div>
                    : forms[QUIZ_INDICES.get(this.state.quizType) as number] ) ;
  }

}