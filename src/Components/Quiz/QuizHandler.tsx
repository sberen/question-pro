import React from 'react';
import {QuizInfo} from './QuizInfo';
// import * as quizes from '../../resources/Questions.json';


interface HandlerProps {
  info : QuizInfo;
}

interface HandlerState {
  currentQuestion : number;
  totalQuestions: number;
  incorrectAnswers: Map<String, [String, String]>;
  questions: any[];
  resultsPage: boolean;
}

export class QuizHandler extends React.Component<HandlerProps, HandlerState> {
  constructor(props : any){
    super(props);
    let quizUID = this.props.info.uid
    let count: number = 0;
    let Qs: any[] = [];
    var quizes = require('../../resources/Questions.json');
    console.log(quizes);

    for (let quiz of quizes){
      if (quiz.uid === quizUID){
        count = quiz.count;
        Qs = quiz.questions
      }
    }
    this.state = {
      currentQuestion: 1,
      totalQuestions: count,
      incorrectAnswers: new Map(),
      questions:Qs,
      resultsPage: false
    }
  }

  render() {
    var testString: String = "";
    for (let question of this.state.questions){
      testString += question.prompt + "\n";
    }
    return(
      <div>
        <div><h5>{this.props.info.name}<br/>
        Question: {this.state.currentQuestion} / {this.state.totalQuestions}
        </h5></div>
        {testString.split('\n').map((item, key) => {
          return <span key={key}>{item}<br/></span>
        })}

      </div>
    )
  }
}