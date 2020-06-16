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
import { analytics } from 'firebase';


interface MainPageState {
  pageNum: number;  // the page to be displayed
  user: firebase.User | null;
  quiz : QuizInfo | null; // Information regarding chosen quiz, undefined if nothing has been chosen
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
      quiz: null,
      user: null,
      pageNum: 0,
      quizzes: []
    }
  }

  componentWillUnmount() {
    auth.signOut();
  }

  componentDidMount()  {   
    auth.onAuthStateChanged((newUser) => this.registerAuthListener(newUser));
  }
  
  render() {

    const pages = [
      <QuizSelector quizzes={this.state.quizzes} changeQuiz={(qz:QuizInfo) => {this.setPage(1); this.setState({quiz: qz})}}/>, 
        <QuizHandler info={this.state.quiz!} onBack={() => this.setPage(0)}/>,
        <UploadQuiz submit={(qz: QuizInfo) => this.addQuiz(qz)} afterSubmit={() => this.setPage(0)}/>
    ];

    return (
      <div>
        <div id="toolbar">
          <TopBar user={this.state.user} onQuizClick={() => this.setPage(0)} makeQuiz={() => this.setPage(2)} onSignOut={() => this.signOut()}/>
        </div>
        {this.state.user ? pages[this.state.pageNum] : <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />}
      </div>
    )
  }

  setPage(page: number) {
    if (this.state.user) {
      this.setState({pageNum: page});
    }
  }

  addQuiz(qz: QuizInfo) {
    this.setState((prev: MainPageState) => ({
      quizzes: [...prev.quizzes, qz]
    }))
  }


  signOut() {
    auth.signOut();
  }

  async registerAuthListener(newUser: firebase.User | null) {
    var stateQuizzes: QuizInfo[] = [];
    if (newUser) {
      var user: firebase.firestore.DocumentReference = firestore.collection("users").doc(newUser.uid);

      let quizzes: string[] = await user.get()
                                        .then((snap: firebase.firestore.DocumentData) => {
                                          return snap.get("quizzes");
                                        });

      if (quizzes) {
        for (let quiz of quizzes) {
          let object = await firestore.collection("quizzes").doc(quiz).get();
          stateQuizzes.push(new QuizInfo(object.get("title"), object.get("type"), quiz, object.get("questions")));
        }
      } else {
        let name : string[] = newUser.displayName!.split(' ');

        user.set({
          first: name[0],
          last: name.length !== 0 ? name[name.length - 1]: null,
          quizzes: []
        }).then(() => {
          console.log("Document set properly");
        }).catch((error) => {
          console.error("Document Not Set");
        })
      }

      console.log(stateQuizzes)
    } 

    this.setState({user: newUser, quizzes: stateQuizzes, quiz: null, pageNum: 0});
  }
}