import React from 'react';
import { QuizInfo } from '../Quiz/QuizInfo';
import { QUIZ_TYPES } from '../Quiz/QuizTypes';
import { Button, Grid } from '@material-ui/core';
import {MCForm} from './MCForm';
import "./UploadQuiz.css";

interface UploadProps {
  submit: (qz: QuizInfo) => void;
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
    const buttons: any[] = QUIZ_TYPES.map((val) => <Grid item id="button" spacing={3} xs={12}>
                                                      <Button onClick={() => this.setState({quizType: val.shortName})} color='primary' variant='outlined'>{val.longName}</Button>
                                                    </Grid>);

    
    return ( !this.state.quizType
                    ?  <div>
                        <h3>New Quiz Type:</h3> 
                        {buttons}
                      </div>
                    : <MCForm quizType={this.state.quizType} 
                              afterSubmit={this.props.afterSubmit} 
                              submit={this.props.submit}
                              onBack={() => this.setState({quizType: undefined})}/> ) ;
  }

}