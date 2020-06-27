import React from 'react'
import { QuizInfo } from '../QuizInfo';
import { QuizResult } from '../QuizResult';
import { Grid, Card, CardContent, CardActions, Typography, Box, Button} from '@material-ui/core';
import CountUp from 'react-countup';
import { Results } from './ResultsPage';
import "./ResultsPage.css";

interface MegaProps {
  megaQ : QuizInfo;
  quizzes: QuizInfo[];
  results: QuizResult[];
  retake: (Qs: any[]) => void,
  toNormal: (quiz: QuizInfo) => void
  onBack: () => void
}

interface MegaState {
  resultIndex: number | undefined;
  grade: number;
}

// this class renders the by quiz results for a mega quiz
export class MegaResults extends React.Component<MegaProps, MegaState> {
  constructor(props: MegaProps) {
    super(props);
    
    let {results, megaQ} = this.props;

    let wrongQs: number = 0;

    for(let i = 0; i < results.length; i++) {
      wrongQs += results[i].incorrectIndices.length;
    }

    let grade: number = this.grade(wrongQs, megaQ.questions.length);

    
    this.state = {
      resultIndex: undefined,
      grade: grade
    }
  }

  render() {

    let { quizzes, results, toNormal } = this.props;
    let { resultIndex } = this.state;

    return (resultIndex !== undefined ? Results(quizzes[resultIndex], 
                                  results[resultIndex], 
                                  (Qs: any[])=> toNormal(new QuizInfo(quizzes[resultIndex!].name, 
                                                                      quizzes[resultIndex!].type, 
                                                                      quizzes[resultIndex!].uid, 
                                                                      Qs)), 
                                  () => this.setState({resultIndex: undefined}), true)
                        :
                          <Grid container spacing={3}>
                            {this.title()}
                            {this.cards()}
                          </Grid>
    )
  }

  // renders each of the cards for the subquizzes that shows the
  // grade and an option to see question by question information
  // for that subquiz
  cards() {
    return this.props.results.map((val, idx) => {
          let grade : number = this.grade(val.incorrectIndices.length, this.props.quizzes[idx].questions.length);
          return (
            <Grid item component={Card} xs={12} sm={12} md={12} className={grade >= 80 ? "correctCard" : "incorrectCard"}>
                  <CardContent>
                    <Typography variant='h5' color="primary" >
                      <Box fontWeight="fontWeightBold">{this.props.quizzes[idx].name}</Box>
                    </Typography>
                    <Typography variant='h6' color="primary" className={grade >= 80 ? "correctText" : "incorrectText"}>
                      <Box fontWeight="fontWeightBold">
                        Grade: <CountUp start={0} end={grade} duration={2.5}/>%
                      </Box>
                    </Typography>
                </CardContent>
                <CardActions>
                  <div style={{flexGrow: 1}}/>
                  <Button variant='outlined' color='primary' onClick={() => this.setState({resultIndex: idx})}>See In-Depth Results</Button>
                </CardActions>
            </Grid>
        )})
  }

  // renders the title card that has the overall grade
  // and buttons to retake the mega quiz and go back home
  title() {

    return (
      <Grid item component={Card} xs={12} md={12} sm={12} className={this.state.grade >= 80 ? "goodTitle" : "badTitle"}>
          <CardContent>
            <Typography variant="h5" color="primary">
              <Box fontWeight="fontWeightBold">{this.props.megaQ.name}</Box>
            </Typography>
            <Typography variant='h5' className={this.state.grade >= 80 ? "correctText" : "incorrectText"}>
            <Box fontWeight={"fontWeightBold"}>Grade: <CountUp start={0} end={this.state.grade} duration={2.5}/>%</Box>
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant='outlined' 
                    color='primary' 
                    onClick={() => this.props.retake(this.props.megaQ.questions)}
                    >Retake Quiz
            </Button>
            <Button variant='outlined'
                    color='primary'
                    onClick={() => this.props.onBack()}
                    > Home
            </Button>
          </CardActions>
        </Grid>
    )
  }

  // calculates the grade for a quiz given
  // the number of wrong and the length of the quiz.
  grade(wrong : number, length: number) {
    return Math.round(100*((length - wrong) / length))
  }
}