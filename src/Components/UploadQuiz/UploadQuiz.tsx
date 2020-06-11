import React from 'react';
import { QuizInfo } from '../Quiz/QuizInfo';
import { QUIZ_TYPES, QUIZ_INDICES } from '../Quiz/QuizTypes';
import { Button, Grid } from '@material-ui/core';
import {FormProps} from './Form';
import "./UploadQuiz.css";
import { MCForm } from './MCForm';
import { SAForm } from './SAForm';
import {MSAForm} from './MSAForm';

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
                    ?  <div>
                        <h3>New Quiz Type:</h3> 
                        {buttons}
                      </div>
                    : forms[QUIZ_INDICES.get(this.state.quizType) as number] ) ;
  }

}