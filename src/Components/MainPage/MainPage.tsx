import React from 'react';
import './MainPage.css';
import { TopBar } from '../TopBar/TopBar';
import { QuizSelector } from './QuizSelector';
import { QuizInfo } from '../Quiz/QuizInfo';
import {QuizHandler} from '../Quiz/QuizHandler'
import UploadQuiz from '../UploadQuiz/UploadQuiz';
import { auth, firebaseUIConfig, firestore } from '../../firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { QuizInfoMini } from '../Quiz/QuizInfoMini';


interface MainPageState {
  pageNum: number;  // the page to be displayed
  quiz : QuizInfo | null; // Information regarding chosen quiz, undefined if nothing has been chosen
  quizzes: QuizInfoMini[];
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
        <QuizSelector quizzes={this.state.quizzes} changeQuiz={(qz:QuizInfo) => {this.setState({quiz: qz, pageNum: 1})}}/>, 
        <QuizHandler info={this.state.quiz!} onBack={() => this.setPage(0)}/>,
        <UploadQuiz submit={(qz: QuizInfoMini) => this.addQuiz(qz)} afterSubmit={() => this.setPage(0)}/>
    ];

    return (
      <div>
        <div id="toolbar">
          <TopBar user={auth.currentUser} onQuizClick={() => this.setPage(0)} makeQuiz={() => this.setPage(2)} onSignOut={() => this.signOut()}/>
        </div>
        <div id="app">
          {auth.currentUser ? pages[this.state.pageNum] : <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />}
        </div>
      </div>
    )
  }

  setPage(page: number) {
    if (auth.currentUser) {
      this.setState({pageNum: page});
    }
  }

  addQuiz(qz: QuizInfoMini) {
    this.setState((prev: MainPageState) => ({
      quizzes: [...prev.quizzes, qz]
    }));
  }


  signOut() {
    auth.signOut();
  }

  async registerAuthListener(newUser: firebase.User | null) {
    var stateQuizzes: QuizInfoMini[] = [];
    if (newUser) {
      var user: firebase.firestore.DocumentReference = firestore.collection("users").doc(newUser.uid);

      let returned = await user.get()
                              .then((snap: firebase.firestore.DocumentData) => {
                                return snap.get("quizzes");
                              });

      if (returned) {
        console.log(returned);
        for (let quiz of Object.keys(returned)) {
          let object: string[] = returned[quiz];
          console.log(object);
          stateQuizzes.push(new QuizInfoMini(object[0], object[1], quiz));
        }
      } else {
        let name : string[] = newUser.displayName!.split(' ');

        user.set({
          first: name[0],
          last: name.length !== 0 ? name[name.length - 1]: null,
          quizzes: {}
        }).then(() => {
          console.log("Document set properly");
        }).catch((error) => {
          console.error("Document Not Set");
        })
      }

      console.log(stateQuizzes)
    } 

    this.setState({quizzes: stateQuizzes, quiz: null, pageNum: 0});
  }
}