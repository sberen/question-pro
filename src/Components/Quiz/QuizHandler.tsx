import React from 'react';
import {QuizInfo} from './QuizInfo';
import {ShortAnswer} from './QuestionHandler/ShortAnswer';
import ResultsPage from './QuestionHandler/ResultsPage';
import { MultipleChoice } from './QuestionHandler/MultipleChoice';
// import * as quizes from '../../resources/Questions.json';


interface HandlerProps {
  info : QuizInfo;
  onBack: () => void;
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
    var quizzes = require('../../resources/Questions.json');

    for (let quiz of quizzes){
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
    return (
      !this.state.resultsPage ? <div>
        <div><h5>{this.props.info.name}<br/>
        Question: {this.state.currentQuestion} / {this.state.totalQuestions}
        </h5></div>
        {/* {testString.split('\n').map((item, key) => {
          return <span key={key}>{item}<br/></span>
        })} */}
        <MultipleChoice 
          question={this.state.questions[this.state.currentQuestion-1]}
          changeAnswer={(ans: string) => this.updateAnswer(ans)} 
          changeQuestion={(num: number) => this.changeQuestion(num)} 
          isFirst={this.state.currentQuestion === 1}
          isLast={this.state.currentQuestion === this.state.totalQuestions}
          answer={this.state.answers[this.state.currentQuestion -1]}
        />
        
      </div> : ResultsPage(this.state.questions, this.state.answers, (Qs: any[]) => this.shrinkQs(Qs), () => this.props.onBack())
    );
  }

  updateAnswer = (ans: string) =>{
    const newAnswers = this.state.answers.slice();
    newAnswers[this.state.currentQuestion-1] = ans;
    this.setState({
      answers: newAnswers,
    });
  }

  changeQuestion(num: number) {
    const stillGoing: boolean = (this.state.currentQuestion + num) <= this.state.totalQuestions;
    this.setState({currentQuestion : this.state.currentQuestion + num, resultsPage: !stillGoing});
  }

  shrinkQs(newQs: any[]) {
    const newAns: string[] = [];
    for(let i = 0; i < newQs.length; i++) {
      newAns.push("");
    }
    this.setState({
      currentQuestion: 1, 
      totalQuestions: newQs.length,
      questions: newQs,
      answers: newAns,
      resultsPage: false
    });
  }
}