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
import { QuizResult } from './QuizResult';
import { MegaResults } from './QuestionHandler/MegaResults';

interface HandlerProps {
  info : QuizInfo; // Identification information of the quiz
  onBack: () => void; // Go back to Quiz selection
  megaQs: QuizInfo[] | null;
}

interface HandlerState {
  currentQuestion : number; // Current questions number
  quiz: QuizInfo; // Identification information of the quiz
  indicesMap: Map<any, [number, number]> | undefined; // maps a question to its index within the parent and the parent's index
  answers: any[]; // Current answer responses
  resultsPage: boolean; // True if showing results page
  problemsPerPage: number;
  result : QuizResult | QuizResult[] | undefined;
}

// The quiz handling component that renders and manages
// a single quiz, as well as the results for that quiz
export class QuizHandler extends React.Component<HandlerProps, HandlerState> {

  constructor(props : any){
    super(props);

    let result;
    let map: Map<any, [number, number]> | undefined = undefined;

    if (this.props.megaQs) { // if we have megaQs, then create an array of responses
      map = new Map<any, [number, number]>(); // wherein each element is an array of that quiz's answers
      result = [];
      for (let i = 0; i < this.props.megaQs.length; i++) {
        for (let j = 0; j < this.props.megaQs[i].questions.length; j++) {
          this.props.megaQs[i].questions[j].questionType = this.props.megaQs[i].type;
          map.set(this.props.megaQs[i].questions[j], [i, j]); //[parent's index, index within parent]
        }
        result.push(this.populateAnswers(this.props.megaQs[i]));
      }
      this.shuffleQs(this.props.info.questions);
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
      result: undefined
    }
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
                          <Grid item component={Card} xs={12} sm={12} md={12} className={'card'}>
                            <CardActions>
                              {this.renderButtons()}
                            </CardActions>
                          </Grid>
                        </Grid>)
                        : this.results();
  }

  // shuffles the questions in place, only done for
  // mega quizzes.
  shuffleQs(questions: any[]) {
    for (var i = questions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = questions[i];
      questions[i] = questions[j];
      questions[j] = temp;
    }
  }

  // returns the correct results component based 
  // on the current type of quiz
  results() {
    return this.state.quiz.type === "Mega" 
            ? <MegaResults megaQ={this.state.quiz}
                           quizzes={this.props.megaQs!} 
                           results={this.state.result as QuizResult[]}
                           retake={(Qs: any[]) => this.shrinkQs(Qs)}
                           toNormal={(qz:QuizInfo ) => this.changeQuiz(qz)}
                           onBack={() => this.props.onBack()}
                           />
            :  Results(this.state.quiz, 
                        this.state.result as QuizResult,
                        (Qs: any) => this.shrinkQs(Qs),
                        () => this.props.onBack(), false)
  }

  // generates props for question at index
  quizProps = (index: number) => {
    let response;
    if (this.state.quiz.type === "Mega") {
      let question = this.state.quiz.questions[index];
      let indices : [number, number] = this.state.indicesMap!.get(question)!;

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

  // renders the questions for this quiz based on the questionType property
  // on each question.
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
                    this.quizTypes(this.quizProps(index))[QUIZ_INDICES.get(this.state.quiz.questions[index].questionType) as number]
    );

    return questions
  }

  // change answer to ans for current question
  updateAnswer = (index:number, ans: string | string[]) => {
    const newAnswers = this.state.answers.slice();
    if (this.state.quiz.type === "Mega") {
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
  async changeQuestion(num: number) {
    let stillGoing: boolean = (this.state.currentQuestion + num) <= this.state.quiz.questions.length;
    let temp : QuizResult | QuizResult[] | undefined = undefined;
    if (this.state.problemsPerPage === -1){
      stillGoing = false;
      if (this.state.quiz.type !== "Mega") {
        await QuizResult.build(this.state.quiz, this.state.answers).then(function(info) {
          temp = info;
        });
      } else { // need results for each sub-quiz, looping over array
        temp = [];
        for(let i = 0; i < this.props.megaQs!.length; i++) {
          let quiz: QuizResult = await QuizResult.build(this.props.megaQs![i], this.state.answers[i]);
          temp.push(quiz);
        }
      }
    }
    this.setState({currentQuestion : this.state.currentQuestion + num, resultsPage: !stillGoing, result : temp});
  }

  // Create new quiz with newQs (intended includes subset of questions from current Qs)
  // ONLY CALLED IF NEW Qs IS OF SAME TYPE AS CURRENT QUIZ (ie. single to single and mega to mega)
  // *** use changeQuiz to change from a mega to a single) ***
  shrinkQs(newQs: any[]) {
    let newAns: any[];
    if (this.state.quiz.type === "Mega") { // re-set mega answers in order to handle mega retest
      newAns = this.props.megaQs!.map((val) => this.populateAnswers(val));
    } else {
      newAns = (this.populateAnswers(new QuizInfo("", this.state.quiz.type, "", newQs)));
    }
    const id : string = (newQs.length === this.state.quiz.questions.length) ? this.state.quiz.uid : "";
    const name : string = (newQs.length === this.state.quiz.questions.length) ?
          this.state.quiz.name : this.state.quiz.name +" Modified";
    
    this.setState({
      currentQuestion: 1,
      quiz: new QuizInfo(name, this.state.quiz.type, id, newQs),
      answers: newAns,
      resultsPage: false
    });
  }

  // changes the current quiz from a mega to a normal quiz.
  // important for the case in which a user decides to retake
  // a sub quiz from a mega quiz.
  changeQuiz(qz: QuizInfo) {
    const newAns : any[] = this.populateAnswers(qz);
    
    this.setState({
      quiz: qz,
      currentQuestion: 1,
      answers: newAns,
      resultsPage: false, 
    })
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

  // renders the buttons for the quiz, either one or two depending
  // on where they are at in the quiz and the number of problems
  // per page.
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
}