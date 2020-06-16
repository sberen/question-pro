import React from 'react';
import './MainPage.css';
import { TopBar } from '../TopBar/TopBar';
import { QuizSelector } from './QuizSelector';
import { QuizInfo } from '../Quiz/QuizInfo';
import {QuizHandler} from '../Quiz/QuizHandler'
import UploadQuiz from '../UploadQuiz/UploadQuiz';
import { auth, firebaseUIConfig, firestore } from '../../firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { lighten } from '@material-ui/core';


interface MainPageState {
  pageNum: number;  // the page to be displayed
  user: any;
  quiz : QuizInfo; // Information regarding chosen quiz, undefined if nothing has been chosen
  quizzes: QuizInfo[];
}

export class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: any) {
    super(props);

    /*let fromFile = require("../../resources/Questions.json");

    const newQuizzes: QuizInfo[] = [];

    for(let quiz of fromFile) {
      newQuizzes.push(new QuizInfo(quiz.title, quiz.type, quiz.uid, quiz.questions));
    }
    */

    this.state = {
      quiz: new QuizInfo(),
      user: null,
      pageNum: 0,
      quizzes: []
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((newUser) => {
      this.setState({user: newUser});
      var quizzes: string[] = [];
      var stateQuizzes: QuizInfo[] = [];
      console.log(newUser);

      if (newUser) {
        firestore.collection("users").doc(newUser.uid).get()
        .then(function(user: firebase.firestore.DocumentSnapshot) {
          if (user.exists) {
            console.log(user.get("quizzes"));
          }
        });


        quizzes.forEach((val:string) => {
          firestore.collection("quizzes").doc(val).get()
          .then(function(user: firebase.firestore.DocumentSnapshot) {
            stateQuizzes.push(new QuizInfo(user.get("title"), user.get("type"), val, user.get("questions")))
          })
        })
      }

      this.setState({quizzes: stateQuizzes});
    });
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
          <TopBar user={this.state.user} onQuizClick={() => this.setState({quiz: new QuizInfo(), pageNum: 0})} makeQuiz={() => this.setState({pageNum: 2})}/>
        </div>
        {this.state.user ? pages[this.state.pageNum] : <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />}
        <button onClick={() => auth.signOut()} >Sign Out</button>
      </div>
    )
  }

  getQuiz() {

  }

  addQuiz(qz: QuizInfo) {
    this.setState((prev: MainPageState) => ({
      quizzes: [...prev.quizzes, qz]
    }))
  }
}

class User {
  first: string;
  last: string;
  quizzes: any[];

  constructor(first: string, last: string, quizzes: any[]) {
    this.first = first;
    this.last = last;
    this.quizzes = quizzes;
  }

  toString() {
    return this.first + " " + this.last + " " + this.quizzes;
  }
}

const cityConverter = {
  toFirestore: function(user: User) {
      return {
          first: user.first,
          last: user.last,
          quizzes: user.quizzes
          }
  },
  fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot, options: firebase.firestore.SnapshotOptions){
      const data: any = snapshot.data(options);
      return new User(data.first, data.last, data.quizzes);
  }
}