import React from 'react';
import './MainPage.css';
import { TopBar } from '../TopBar/TopBar';
import { QuizSelector } from './QuizSelector';
import { QuizInfo } from '../Quiz/QuizInfo';
import {QuizHandler} from '../Quiz/QuizHandler'



interface MainPageState {
  chosenQuiz: boolean;  // Whether or not a quiz has been chosen
  quiz : QuizInfo; // Information regarding chosen quiz, undefined if nothing has been chosen
}

export class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      quiz: new QuizInfo(),
      chosenQuiz: false
    }
  }
  
  render() {
    const quizSel: any = <QuizSelector changeQuiz={(qz:QuizInfo) => this.setState({quiz: qz, chosenQuiz: true})}/>;
    
    const quizPage: any = <QuizHandler info={this.state.quiz} onBack={() => this.setState({chosenQuiz: false})}/>;
    return (
      <div>
        <div id="toolbar">
          <TopBar onQuizClick={() => this.setState({quiz: new QuizInfo(), chosenQuiz: false})}/>
        </div>
        {this.state.chosenQuiz ? quizPage : quizSel}
      </div>
    )
  }
}