import React from 'react';
import {QuizInfo} from './QuizInfo';
import {QUIZ_INDICES, SINGLE} from './QuizTypes';
import {ShortAnswer} from './QuestionHandler/ShortAnswer';
import {QuestionProps} from './QuestionHandler/QuestionHandler';
import {SingleResults, MultiResults} from './QuestionHandler/ResultsPage';
import { MultipleChoice } from './QuestionHandler/MultipleChoice';
import { MultiShortAnswers } from './QuestionHandler/MultiShortAnswer';
import { LongAnswer } from './QuestionHandler/LongAnswer';
// import * as quizes from '../../resources/Questions.json';


interface HandlerProps {
  info : QuizInfo;
  onBack: () => void;
  quiz: QuizInfo;
}

interface HandlerState {
  currentQuestion : number;
  totalQuestions: number;
  incorrectAnswers: Map<string, [string, string]>;
  questions: any[];
  answers: any[];
  resultsPage: boolean;
}

export class QuizHandler extends React.Component<HandlerProps, HandlerState> {
  constructor(props : any){
    super(props);
    let quizUID = this.props.info.uid
    let Qs: any[] = this.props.quiz.questions;

    var ans = this.populateAnswers(Qs);
    console.log(ans);

    this.state = {
      currentQuestion: 1,
      totalQuestions: Qs.length,
      incorrectAnswers: new Map(),
      questions:Qs,
      answers: ans,
      resultsPage: false
    }
  }

  render() {
    const props: QuestionProps = {
          question: this.state.questions[this.state.currentQuestion-1],
          changeAnswer: (ans: string| string[]) => this.updateAnswer(ans),
          changeQuestion: (num: number) => this.changeQuestion(num),
          isFirst: this.state.currentQuestion === 1,
          isLast: this.state.currentQuestion === this.state.totalQuestions,
          answer: this.state.answers[this.state.currentQuestion -1]
    }

    const quizTypes = [
      <ShortAnswer {...props}/>,
      <MultipleChoice {...props}/>,
      <MultiShortAnswers {...props}/>,
      <LongAnswer {...props}/>
    ]

    return (
      !this.state.resultsPage ? <div>
        <div><h5>{this.props.info.name}<br/>
        Question: {this.state.currentQuestion} / {this.state.totalQuestions}
        </h5></div>
        {quizTypes[QUIZ_INDICES.get(this.props.info.type) as number]}
        
      </div> : MultiResults(this.state.questions, this.state.answers, (Qs: any[]) => this.shrinkQs(Qs), () => this.props.onBack())
    );
  }

  updateAnswer = (ans: string | string[]) => {
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
    const newAns: any[] = this.populateAnswers(newQs);
    this.setState({
      currentQuestion: 1, 
      totalQuestions: newQs.length,
      questions: newQs,
      answers: newAns,
      resultsPage: false
    });
  }

  populateAnswers(Qs: any[]){
    let count = Qs.length;

    if (SINGLE.includes(this.props.info.type)){
      var singleString = new Array<string>(count);
      for (var i = 0; i< singleString.length; i++){
        singleString[i] = "";
      }
      return singleString;
    } else {
      var multiString = new Array<string[]>(count);
      for (var i = 0; i< multiString.length; i++ ){
        multiString[i] = new Array<string>(Qs[i].prompts.length);
        for(var j = 0; j< Qs[i].prompts.length; j ++){
          multiString[i][j] = "";
        }
      }
      return multiString;
    }
    

  }
}