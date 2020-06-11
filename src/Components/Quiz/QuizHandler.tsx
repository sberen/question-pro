import React from 'react';
import {QuizInfo} from './QuizInfo';
import {QUIZ_INDICES, SINGLE} from './QuizTypes';
import {ShortAnswer} from './QuestionHandler/ShortAnswer';
import {QuestionProps} from './QuestionHandler/QuestionHandler';
import {Results} from './QuestionHandler/ResultsPage';
import { MultipleChoice } from './QuestionHandler/MultipleChoice';
import { MultiShortAnswers } from './QuestionHandler/MultiShortAnswer';
import { LongAnswer } from './QuestionHandler/LongAnswer';
// import * as quizes from '../../resources/Questions.json';


interface HandlerProps {
  info : QuizInfo; // Identification information of the quiz
  onBack: () => void; // Go back to Quiz selection
}

interface HandlerState {
  currentQuestion : number; // Current questions number
  quiz: QuizInfo; // Identification information of the quiz
  incorrectAnswers: Map<string, [string, string]>;
  answers: any[]; // Current answer responses
  resultsPage: boolean; // True if showing results page
}

export class QuizHandler extends React.Component<HandlerProps, HandlerState> {

  constructor(props : any){
    super(props);
    let Qs: any[] = this.props.info.questions;

    var ans = this.populateAnswers(Qs);
    console.log(ans);

    this.state = {
      currentQuestion: 1,
      incorrectAnswers: new Map(),
      quiz: this.props.info,
      answers: ans,
      resultsPage: false
    }
  }

  render() {
    const props: QuestionProps = {
          question: this.state.quiz.questions[this.state.currentQuestion-1],
          changeAnswer: (ans: string| string[]) => this.updateAnswer(ans),
          changeQuestion: (num: number) => this.changeQuestion(num),
          isFirst: this.state.currentQuestion === 1,
          isLast: this.state.currentQuestion === this.state.quiz.questions.length,
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
        Question: {this.state.currentQuestion} / {this.state.quiz.questions.length}
        </h5></div>
        {quizTypes[QUIZ_INDICES.get(this.props.info.type) as number]}
        
      </div> : Results(this.state.quiz, this.state.answers, (Qs: any[]) => this.shrinkQs(Qs), () => this.props.onBack())
    );
  }

  // change answer to ans for current question
  updateAnswer = (ans: string | string[]) => {
    const newAnswers = this.state.answers.slice();
    newAnswers[this.state.currentQuestion-1] = ans;
    this.setState({
      answers: newAnswers,
    });
  }

  // Processing request to change question. 
  // Positive num indicates move forward by given value and negative values for going back
  changeQuestion(num: number) {
    const stillGoing: boolean = (this.state.currentQuestion + num) <= this.state.quiz.questions.length;
    this.setState({currentQuestion : this.state.currentQuestion + num, resultsPage: !stillGoing});
  }

  // Create new quiz with newQs (intended include subset of questions from current Qs)
  shrinkQs(newQs: any[]) {
    const newAns: any[] = this.populateAnswers(newQs);
    this.setState({
      currentQuestion: 1, 
      quiz: new QuizInfo(this.state.quiz.name, this.state.quiz.type, this.state.quiz.uid, newQs),
      answers: newAns,
      resultsPage: false
    });
  }

  // returns "Zeroed Out" answers field based on given Qs
  populateAnswers(Qs: any[]){
    let count = Qs.length;

    // Case that the answer can be captured with one string
    if (SINGLE.includes(this.props.info.type)){
      var singleString = new Array<string>(count);
      for (var i = 0; i< singleString.length; i++){
        singleString[i] = "";
      }
      return singleString;
    } 
    // Case that the answer has multiple components and need to be represented as an array
    else {
      var multiString = new Array<string[]>(count);
      for (i = 0; i< multiString.length; i++ ){
        multiString[i] = new Array<string>(Qs[i].prompts.length);
        for(var j = 0; j< Qs[i].prompts.length; j ++){
          multiString[i][j] = "";
        }
      }
      return multiString;
    }
    

  }
}