import React from 'react';
import {QuizInfo} from './QuizInfo';
import {ShortAnswer} from './QuestionHandler/ShortAnswer'
// import * as quizes from '../../resources/Questions.json';


interface HandlerProps {
  info : QuizInfo;
}

interface HandlerState {
  currentQuestion : number;
  totalQuestions: number;
  incorrectAnswers: Map<string, [string, string]>;
  questions: any[];
  answers: string[];
  resultsPage: boolean;
}

export class QuizHandler extends React.Component<HandlerProps, HandlerState> {
  constructor(props : any){
    super(props);
    let quizUID = this.props.info.uid
    let count: number = 0;
    let Qs: any[] = [];
    var quizes = require('../../resources/Questions.json');

    for (let quiz of quizes){
      if (quiz.uid === quizUID){
        count = quiz.count;
        Qs = quiz.questions
      }
    }

    var ans = new Array<string>(count);
    for (var index = 0; index< ans.length; index++){
      ans[index] = ""
    }

    this.state = {
      currentQuestion: 1,
      totalQuestions: count,
      incorrectAnswers: new Map(),
      questions:Qs,
      answers: ans,
      resultsPage: false
    }
  }

  render() {
    // var testString: String = "";
    // for (let question of this.state.questions){
    //   testString += question.prompt + "\n";
    // }
    return(
      <div>
        <div><h5>{this.props.info.name}<br/>
        Question: {this.state.currentQuestion} / {this.state.totalQuestions}
        </h5></div>
        {/* {testString.split('\n').map((item, key) => {
          return <span key={key}>{item}<br/></span>
        })} */}
        <ShortAnswer 
          question={this.state.questions[this.state.currentQuestion-1]}
          changeAnswer={(ans: string) => this.updateAnswer(ans)} 
          changeQuestion={(num: number) => this.setState({currentQuestion : this.state.currentQuestion +num})} 
          isFirst={this.state.currentQuestion === 1}
          isLast={this.state.currentQuestion === this.state.totalQuestions}
          answer={this.state.answers[this.state.currentQuestion -1]}
        />

      </div>
    )
  }

  updateAnswer = (ans: string) =>{
    const newAnswers = this.state.answers.slice();
    newAnswers[this.state.currentQuestion-1] = ans;
    this.setState({
      answers: newAnswers,
    });
  }
}