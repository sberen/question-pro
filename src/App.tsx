import React from 'react';
import { Toolbar } from './Components/Toolbar';
import {QuizSelector} from './Components/QuizSelector';
import './App.css';

interface AppState {
  quiz : string;
  choosingQuiz: boolean
}

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {quiz: '', choosingQuiz: false};
  }

  render() {
    const quizSelect = this.state.choosingQuiz ? <QuizSelector changeQuiz={(qz : string) => this.setQuiz(qz)}/> : null;
    return (
      <div>
          <Toolbar showQuiz={() => this.showQuizSet()}/>
          {quizSelect}
      </div>  
    );
  }

  showQuizSet() {
    this.setState({choosingQuiz: true});
  }

  setQuiz(quizName : string) {
    this.setState({quiz: quizName});
  }
}

