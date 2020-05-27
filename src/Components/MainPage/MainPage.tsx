import React from 'react';
import './MainPage.css';
import { TopBar } from '../TopBar/TopBar';
import { QuizSelector } from './QuizSelector';
import { QuizInfo } from './QuizInfo';



interface MainPageState {
  chosenQuiz: boolean;  // Whether or not a quiz has been chosen
  quiz : QuizInfo | undefined; // Information regarding chosen quiz, undefined if nothing has been chosen
}

export class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      quiz: undefined,
      chosenQuiz: false
    }
  }
  
  render() {
    const quizSel: any = <QuizSelector changeQuiz={(qz:QuizInfo) => this.setState({quiz: qz, chosenQuiz: true})}/>;
    
    const quizPage: any = <div><h5>You picked {this.state.quiz?.name}</h5></div>;
    return (
      <div>
        <div id="toolbar">
          <TopBar onQuizClick={() => this.setState({quiz: undefined, chosenQuiz: false})}/>
        </div>
        {this.state.chosenQuiz ? quizPage : quizSel}
      </div>
    )
  }
}