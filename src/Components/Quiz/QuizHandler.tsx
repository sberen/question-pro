import React from 'react';
import {QuizInfo} from './QuizInfo';
import {QUIZ_INDICES, SINGLE} from './QuizTypes';
import {ShortAnswer} from './QuestionHandler/ShortAnswer';
import {Results} from './QuestionHandler/ResultsPage';
import { MultipleChoice } from './QuestionHandler/MultipleChoice';
import { MultiShortAnswers } from './QuestionHandler/MultiShortAnswer';
import { LongAnswer } from './QuestionHandler/LongAnswer';
import { Button, Grid, Card, Typography, Box, CardActions, CardContent } from '@material-ui/core';
import '../MainPage/QuizSelector.css';
import { firestore, auth } from '../../firebase';
// import * as quizes from '../../resources/Questions.json';


interface HandlerProps {
  info : QuizInfo; // Identification information of the quiz
  onBack: () => void; // Go back to Quiz selection
  megaQs: QuizInfo[] | undefined;
}

interface HandlerState {
  currentQuestion : number; // Current questions number
  quiz: QuizInfo; // Identification information of the quiz
  indicesMap: Map<any, [number, number]> | undefined; // maps a question to its index within the parent and the parent's index
  answers: any[]; // Current answer responses
  resultsPage: boolean; // True if showing results page
  problemsPerPage: number;
  lastAttempt: number;
  wrongQCnt: number[];
}

export class QuizHandler extends React.Component<HandlerProps, HandlerState> {

  constructor(props : any){
    super(props);
    console.log(this.props.info);

    let result;
    let map: Map<any, [number, number]> | undefined = undefined;

    if (this.props.megaQs) {
      map = new Map<any, [number, number]>();
      result = [];
      for (let i = 0; i < this.props.megaQs.length; i++) {
        for (let j = 0; j < this.props.megaQs[i].questions.length; j++) {
          map.set(this.props.megaQs[i].questions[j], [i, j]); //[parent's index, index within parent]
          this.props.megaQs[i].questions[j].questionType = this.props.megaQs[i].type;
        }
        result.push(this.populateAnswers(this.props.megaQs[i]));
      }
    } else {
      for (let i = 0; i < this.props.info.questions.length; i++) {
        this.props.info.questions[i].questionType = this.props.info.type;
      }
      result = this.populateAnswers(this.props.info);
    }

  
    this.state = {
      currentQuestion: 1,
      indicesMap: map,
      quiz: this.props.info,
      answers: result,
      resultsPage: false,
      problemsPerPage: -1,
      lastAttempt: -1,
      wrongQCnt: []
    }
  }

  async componentDidMount()  {
    let user = await firestore.collection("users").doc(auth.currentUser!.uid).get();
    let last = user.get('quizResults.' + this.state.quiz.uid +'.lastAttempt');
    let wrong = user.get('quizResults.' + this.state.quiz.uid +'.wrongQCnt')
    this.setState({
      lastAttempt: last,
      wrongQCnt: wrong
    });
  }

  render() {
    let cur = this.state.currentQuestion;
    let perPage = this.state.problemsPerPage;
    if (perPage === -1){
      perPage= this.state.quiz.questions.length;
    }

    return !this.state.resultsPage ?
                        (<Grid container spacing={3}>
                          <Grid item component={Card} xs={12} md={12} sm={12} className={"card"}>
                            <CardContent>
                              <Typography color="primary" variant='h5'>
                                <Box>{this.state.quiz.name}</Box>
                              </Typography>
                              {this.state.problemsPerPage !== -1 ?
                              <Typography component={"div"} variant='body1'>
                                <Box fontWeight={"fontWeightBold"}>
                                  Page: {Math.ceil(cur/perPage)} / {Math.ceil(this.state.quiz.questions.length/perPage)}
                                </Box>
                              </Typography> : <span></span>}
                            </CardContent>
                            <CardActions>
                              {this.renderButtons()}
                            </CardActions>
                              </Grid>
                          {this.renderQuestions()}
                        </Grid>)
                        : Results(this.state.quiz, this.state.answers, (Qs: any[]) => this.shrinkQs(Qs),
                        () => this.props.onBack(), this.state.lastAttempt, this.state.wrongQCnt,
                        (lastAttempt : number, wrongQCnt: number[]) => this.updateStats(lastAttempt, wrongQCnt))
    ;
  }

  // generates props for question at index
  quizProps = (index: number) => {
    let response;
    if (this.props.megaQs) {
      let question = this.state.quiz.questions[index];
      let indices : [number, number] = this.state.indicesMap!.get(question)!;
      console.log(indices);
      response = this.state.answers[indices[0]][indices[1]];
    } else {
      response = this.state.answers[index];
    }
    return {
      question: this.state.quiz.questions[index],
      changeAnswer: (ans: string| string[]) => this.updateAnswer(index, ans),
      answer: response,
      index: index + 1
    }
  }

  quizTypes = (props: any) =>{
    return [
      <ShortAnswer {...props}/>,
      <MultipleChoice {...props}/>,
      <MultiShortAnswers {...props}/>,
      <LongAnswer {...props}/>
    ]
  }


  renderQuestions = () =>{
    var startIndex = this.state.currentQuestion -1;
    var endIndex = Math.min(startIndex + this.state.problemsPerPage, this.state.quiz.questions.length);
    if (this.state.problemsPerPage === -1) {
      endIndex = this.state.quiz.questions.length;
    }

    var indices = []
    for (var i = startIndex; i< endIndex; i++){
      indices.push(i);
    }

    let questions = indices.map((index: number) =>
                    this.quizTypes(this.quizProps(index))[QUIZ_INDICES.get(this.props.info.questions[index].questionType) as number]
    );

    return questions
  }

  // change answer to ans for current question
  updateAnswer = (index:number, ans: string | string[]) => {
    const newAnswers = this.state.answers.slice();
    if (this.props.megaQs) {
      let question = this.state.quiz.questions[index];
      let indices : [number, number] = this.state.indicesMap!.get(question)!;
      newAnswers[indices[0]][indices[1]] = ans;
    } else {
      newAnswers[index] = ans;
    }
    this.setState({
      answers: newAnswers,
    });
  }

  // Processing request to change question.
  // Positive num indicates move forward by given value and negative values for going back
  changeQuestion(num: number) {
    let stillGoing: boolean = (this.state.currentQuestion + num) <= this.state.quiz.questions.length;
    if (this.state.problemsPerPage === -1){
      stillGoing = false;
    }
    this.setState({currentQuestion : this.state.currentQuestion + num, resultsPage: !stillGoing});
  }

  // Create new quiz with newQs (intended include subset of questions from current Qs)
  shrinkQs(newQs: any[]) {
    const newAns: any[] = this.populateAnswers(new QuizInfo("", this.props.info.type, "", newQs));
    const id : string = (newQs.length === this.state.answers.length) ? this.state.quiz.uid : "";
    const name : string = (newQs.length === this.state.answers.length) ?
          this.state.quiz.name : this.state.quiz.name +" Modified";
    this.setState({
      currentQuestion: 1,
      quiz: new QuizInfo(name, this.state.quiz.type, id, newQs),
      answers: newAns,
      resultsPage: false
    });
  }

  // returns "Zeroed Out" answers field based on given Qs
  populateAnswers(quiz: QuizInfo)  {
    let Qs: any[] = quiz.questions;
    let count = Qs.length;

    // Case that the answer can be captured with one string
    if (SINGLE.includes(quiz.type)){
      var singleString : string[] = new Array<string>(count);
      for (var i = 0; i< singleString.length; i++){
        singleString[i] = "";
      }
      return singleString;
    }
    // Case that the answer has multiple components and need to be represented as an array
    else {
      var multiString : string[][] = new Array<string[]>(count);
      for (i = 0; i< multiString.length; i++ ) {
        multiString[i] = new Array<string>(Qs[i].prompts.length);
        for(let j = 0; j< Qs[i].prompts.length; j ++){
          multiString[i][j] = "";
        }
      }
      return multiString;
    }
  }

  renderButtons = () =>{
    const result : any[] = [];
    var qPerPage = this.state.problemsPerPage;
    var isFirst: boolean = this.state.currentQuestion === 1;
    var isLast: boolean = (qPerPage === -1 ||
      (this.state.currentQuestion + qPerPage) > this.state.quiz.questions.length);
    var secondButton:String;
    if(isLast){
        secondButton = "Finish"
    } else{
        secondButton = "Next"
    }
    if (!isFirst){
        result.push(
            <Button key='back' style={{margin: "5px"}} onClick={() => this.changeQuestion(-1 * qPerPage)} variant='outlined' color='primary'>Back</Button>
        )
    }
    result.push(
        <Button key="next" onClick={() => {this.changeQuestion(1 * qPerPage)}} variant='outlined' color='primary'>
        {secondButton}</Button>
    )
    return result;
  }

  updateStats = (lastAttempt : number, wrongQCnt: number[]) =>{
    this.setState({
      lastAttempt: lastAttempt,
      wrongQCnt: wrongQCnt
    });
  }
}