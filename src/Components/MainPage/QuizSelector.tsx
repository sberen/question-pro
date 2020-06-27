import React from 'react';
import {Button, Grid, Card, CardContent, Typography, CardActions, IconButton, Box} from '@material-ui/core';
import DeleteIcon  from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import InfoIcon from '@material-ui/icons/Info';
import './QuizSelector.css';
import { QuizInfo } from '../Quiz/QuizInfo';
import { QUIZ_INDICES, QUIZ_TYPES } from '../Quiz/QuizTypes';
import { QuizInfoMini } from '../Quiz/QuizInfoMini';
import { firestore, auth } from '../../firebase';
import firebase from 'firebase/app';

interface SelectorProps {
  changeQuiz(qz : QuizInfo) : void;
  makeQuiz: () => void;
  removeQuiz(id : string) : void;
  setMega: (qz: QuizInfo, arr: QuizInfo[]) => void;
  quizzes: QuizInfoMini[];
  getData: (qz: QuizInfoMini) => void;
}

interface SelectorState {
  groupQuizzes: QuizInfoMini[];
}

// Component displays the user's quizzes that they have
// access to, and allows them to choose a variety of actions
// for each.
export class QuizSelector extends React.Component<SelectorProps, SelectorState> {

  constructor(props: SelectorProps) {
    super(props);

    this.state = {
      groupQuizzes: []
    }
  }

  render() {
    const result : any[] = this.props.quizzes.map((quiz:QuizInfoMini, idx:number) => (
        <Grid item component={Card} key={quiz.name} className={"card"} md={3} xs={12} sm={12}>   
          <CardContent>
            <Typography variant='h6' color={"primary"}>{quiz.name}</Typography>
            <Typography variant='body2'>Type: {QUIZ_TYPES[QUIZ_INDICES.get(quiz.type) as number].longName}</Typography>
          </CardContent>
          <CardActions>
            <IconButton aria-label="Take Quiz" style={{ color: "#808080"}} onClick={() => this.selectQuiz(quiz.uid)}>
              <FormatListNumberedIcon />
            </IconButton>
            <IconButton aria-label="to Stats" style={{ color: "#808080"}} onClick={() => this.props.getData(quiz)}>
              <InfoIcon />
            </IconButton>
            {this.state.groupQuizzes.includes(quiz) ? 
                                                        <IconButton aria-label="remove" 
                                                                    style={{ color: "#808080"}} 
                                                                    onClick={() => this.removeGroupQuiz(quiz)}
                                                        >
                                                          <ClearIcon/>
                                                        </IconButton>
                                                    :   <IconButton aria-label="add" 
                                                                    style={{ color: "#808080"}} 
                                                                    onClick={() => this.addGroupQuiz(quiz)}
                                                        >
                                                          <AddIcon/>
                                                        </IconButton>}
            <IconButton aria-label="delete" style={{ color: "#808080"}} onClick={() => this.removeQuiz(quiz.uid)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Grid>
      ));

      result.push(
        <Grid item component={Card} xs={12} md={3} sm={12} className={"card"}>
          <CardContent>
            <Typography variant='h6' color={'primary'}>
              <Box>
                {this.state.groupQuizzes.length ? "Mega Quiz Includes:" : 'Take a "Mega Quiz"'}
              </Box>
            </Typography>
            <Typography variant={'body1'}>
              {this.state.groupQuizzes.length ? this.state.groupQuizzes.map((q: QuizInfoMini) => <Box>{q.name}</Box>)
                                              : <Box>Click the add button on the quizzes you would like to group together!</Box>}
            </Typography>
          </CardContent>
          {this.state.groupQuizzes.length ? (<CardActions>
                                                <IconButton aria-label="Take Quiz" 
                                                            style={{ color: "#808080"}} 
                                                            onClick={() => this.getGroup()}>
                                                  <FormatListNumberedIcon />
                                                </IconButton>
                                            </CardActions>)
                                          : <span></span>}
        </Grid>
      )

    return (<div>
              <Typography style={{margin: "10px"}} variant='h5' color="primary">My Quizzes:</Typography>
              <Grid container spacing={3}>
                  {result.length > 1 ? result : 
                  <Grid item component={Card} style={{margin: "10px"}} xs={12} md={3} sm={12}>
                    <CardContent>
                      <Typography variant='h6'>You haven't made any quizzes yet!</Typography>
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => this.props.makeQuiz()} color="primary" variant='text'>Create A Quiz</Button>
                    </CardActions>
                  </Grid>}
              </Grid>
            </div>);
  }

  // retrieves the desired quiz and sets it
  // as the current quiz to be taken
  async selectQuiz(quiz : string) {
    let qz : QuizInfo = await this.retreiveQuiz(quiz);
    this.props.changeQuiz(qz);
  }

  // simply retrieves and returns a promise of the 
  // desired QuizInfo from the database
  async retreiveQuiz(quiz : string) : Promise<QuizInfo> {
    let object = await firestore.collection("quizzes").doc(quiz).get();
    let qz = new QuizInfo(object.get("title"), object.get("type"), quiz, object.get("questions"));
    return qz;
  }

  // retrieves the group of tests to be taken in a 
  // "mega" format and sets them as the current group
  async getGroup() {
    let result : QuizInfo[] = [];
    let questions: any[] = [];
    for (let quiz of this.state.groupQuizzes) {
      let quizInfo : QuizInfo = await this.retreiveQuiz(quiz.uid);
      result.push(quizInfo);
      questions.push(...quizInfo.questions);
    }

    let megaQuiz : QuizInfo = new QuizInfo("Mega Quiz", "Mega", "XXXX", questions);

    this.props.setMega(megaQuiz, result);
  }

  // removes the selected quiz from the data base 
  // and subsequently updates the user interface.
  removeQuiz(quiz : string){
    let object = firestore.collection("users").doc(auth.currentUser!.uid);
    var key = `quizzes.${quiz}`;
    object.update({
      [key]: firebase.firestore.FieldValue.delete()
    });
    this.props.removeQuiz(quiz);
  }

  // adds a quiz to the desired group of quizzes
  addGroupQuiz(quiz: QuizInfoMini) {
    let temp : QuizInfoMini[] = this.state.groupQuizzes.slice();

    temp.push(quiz);
  
    this.setState({groupQuizzes: temp});
  }

  // removes a quiz from the current list of mega quiz
  // "participant" quizzes
  removeGroupQuiz(quiz: QuizInfoMini) {
    let temp : QuizInfoMini[] = this.state.groupQuizzes.slice();

    let filtered : QuizInfoMini[] = temp.filter((q: QuizInfoMini) => { return q !== quiz});

    this.setState({groupQuizzes: filtered});
  }
}