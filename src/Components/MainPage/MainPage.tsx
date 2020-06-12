import React from 'react';
import './MainPage.css';
import { TopBar } from '../TopBar/TopBar';
import { QuizSelector } from './QuizSelector';
import { QuizInfo } from '../Quiz/QuizInfo';
import {QuizHandler} from '../Quiz/QuizHandler'
import UploadQuiz from '../UploadQuiz/UploadQuiz';
import * as firebase from 'firebase/app';
import 'firebase/firestore';



interface MainPageState {
  pageNum: number;  // Whether or not a quiz has been chosen
  quiz : QuizInfo; // Information regarding chosen quiz, undefined if nothing has been chosen
  quizzes: QuizInfo[];
}

export class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: any) {
    super(props);

    let fromFile = require("../../resources/Questions.json");

    const newQuizzes: QuizInfo[] = [];

    for(let quiz of fromFile) {
      newQuizzes.push(new QuizInfo(quiz.title, quiz.type, quiz.uid, quiz.questions));
    }

    this.state = {
      quiz: new QuizInfo(),
      pageNum: 0,
      quizzes: newQuizzes
    }
  }

  componentDidMount() {

    const firebaseConfig = {
      apiKey: "AIzaSyBVtbyerfW6d_477bvl1ffMj1Wez75cakg",
      authDomain: "questionpro-65223.firebaseapp.com",
      databaseURL: "https://questionpro-65223.firebaseio.com",
      projectId: "questionpro-65223",
      storageBucket: "questionpro-65223.appspot.com",
      messagingSenderId: "880645784876",
      appId: "1:880645784876:web:c0aee748808ff73ab65889",
      measurementId: "G-S6W8V13Y0E"
    };

    firebase.initializeApp(firebaseConfig);

    var db = firebase.firestore();

    // db.collection("users"). add({
    //   first: "Sam",
    //   last: "Berensohn",
    //   born: 2000
    // }).then(function(docRef: any) {
    //   console.log("Document written with ID: ", docRef.id);
    // })
    // .catch(function(error: any) {
    //     console.error("Error adding document: ", error);
    // });

  }
  
  render() {

    const pages = [
      <QuizSelector quizzes={this.state.quizzes} changeQuiz={(qz:QuizInfo) => this.setState({quiz: qz, pageNum: 1})}/>, 
        <QuizHandler info={this.state.quiz} onBack={() => this.setState({pageNum: 0})}/>,
        <UploadQuiz submit={(qz: QuizInfo) => this.addQuiz(qz)} afterSubmit={() => this.setState({pageNum: 0})}/>
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

  addQuiz(qz: QuizInfo) {
    this.setState((prev: MainPageState) => ({
      quizzes: [...prev.quizzes, qz]
    }))
  }
}