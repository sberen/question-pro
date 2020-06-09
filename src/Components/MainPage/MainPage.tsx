import React from 'react';
import './MainPage.css';
import { TopBar } from '../TopBar/TopBar';
import { QuizSelector } from './QuizSelector';
import { QuizInfo } from '../Quiz/QuizInfo';
import {QuizHandler} from '../Quiz/QuizHandler'
import UploadQuiz from '../UploadQuiz/UploadQuiz';



interface MainPageState {
  pageNum: number;  // Whether or not a quiz has been chosen
  quiz : QuizInfo; // Information regarding chosen quiz, undefined if nothing has been chosen
}

export class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      quiz: new QuizInfo(),
      pageNum: 0
    }
  }
  
  render() {

    const pages = [
      <QuizSelector changeQuiz={(qz:QuizInfo) => this.setState({quiz: qz, pageNum: 1})}/>, 
        <QuizHandler info={this.state.quiz} onBack={() => this.setState({pageNum: 0})}/>,
        <UploadQuiz />
    ];

    return (
      <div>
        <div id="toolbar">
          <TopBar onQuizClick={() => this.setState({quiz: new QuizInfo(), pageNum: 0})} makeQuiz={() => this.setState({pageNum: 2})}/>
        </div>
        {pages[this.state.pageNum]}
      </div>
    )
  }
}