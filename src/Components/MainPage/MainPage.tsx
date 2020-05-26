import React from 'react';
import './MainPage.css';
import { TopBar } from '../TopBar/TopBar';
import { QuizSelector } from './QuizSelector';


interface MainPageState {
  quizType: string | undefined;
  chooseQuiz: boolean;
}

export class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      quizType: undefined,
      chooseQuiz: false
    }
  }
  
  render() {
    const quizSel: any = <QuizSelector changeQuiz={(qz:string) => this.setState({quizType: qz, chooseQuiz: false})}/>;
    
    const quizPage: any = <div><h5>You picked {this.state.quizType}</h5></div>;
    return (
      <div>
        <div id="toolbar">
          <TopBar onQuizClick={() => this.setState({quizType: undefined, chooseQuiz: true})}/>
        </div>
        {!this.state.chooseQuiz && this.state.quizType ? quizPage : quizSel}
      </div>
    )
  }
}