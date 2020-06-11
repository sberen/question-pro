import React from 'react';
import { QuizInfo } from '../Quiz/QuizInfo';
import { QUIZ_TYPES } from '../Quiz/QuizTypes';
import { Button, Grid } from '@material-ui/core';
import SAForm from './SAForm';
import "./UploadQuiz.css";

export interface FormProps {
  submit: (qz: QuizInfo) => void;
  onBack: () => void;
}


interface UploadState {
  quizType: string | undefined;
  questions: any[];
}

export default class UploadQuiz extends React.Component<FormProps, UploadState> {
  constructor(props: any) {
    super(props);
    this.state = {
      questions: [],
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
                    : <SAForm onBack={this.props.onBack} submit={this.props.submit}/> ) ;
  }

}