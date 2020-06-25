import React from 'react';
import { QuizStats, Attempt } from './QuizStats';
import { Grid, Card, CardContent, Typography, Box } from'@material-ui/core';
import CountUp from 'react-countup';
import {Line} from 'react-chartjs-2';
import '../Quiz/QuestionHandler/ResultsPage.css';

const ATTEMPTS : number = 5;
const MISSED : number = 4;

interface StatsProps {
  quiz: QuizStats;
}

interface StatsState {
  attempts: Attempt[];
  sortedMissed: number[];
  indicesMap: Map<number, number>;
}

export class Stats extends React.Component<StatsProps, StatsState> {

  constructor(props: StatsProps) {
    super(props);

    let attempts: Attempt[] = Object.keys(this.props.quiz.attempts).map((val) => {

      let indices = this.props.quiz.attempts[val].incorrectIndex;
      let grade = Math.round(100*((this.props.quiz.wrongQCount.length - indices.length) /this.props.quiz.wrongQCount.length));

      return ({
       incorrectIndex: indices,
       time: this.props.quiz.attempts[val].time,
       grade: grade
     })});

    attempts.sort((a,b) => b.time.toMillis() - a.time.toMillis());

    let indices : Map<number, number> = new Map<number,number>();
    let newArr : number[] = [];

    this.props.quiz.wrongQCount.forEach((val, idx) => {indices.set(idx, val); newArr.push(idx)});

    newArr.sort((a,b) => indices.get(b)! - indices.get(a)!);

    this.state = {
      attempts: attempts,
      sortedMissed: newArr,
      indicesMap: indices
    }
  }

  render() {

    let totalQs : number = this.props.quiz.overall.attemptCnt * this.props.quiz.wrongQCount.length;
    let average : number = Math.round(100 * ((totalQs - this.props.quiz.overall.wrongCnt) / totalQs));

    let name : string = this.state.attempts.length && average >= 80 ? "goodTitle" : (this.state.attempts.length ? "badTitle" : "card")

    return (
      <div>
        <Grid container spacing={3}>
          <Grid item component={Card} xs={12} md={12} sm={12} className={"card"}>
            <Grid container spacing={3}>
              <Grid item>
                <Typography variant='h5' color='primary'>
                  <Box fontWeight={"fontWeightBold"}>{this.props.quiz.name}</Box>
                </Typography>
              </Grid>

              {this.state.attempts.length !== 0
                  ?
                  <Grid item >
                    <Typography  variant='h6' className={average >= 80 ? "correctText" : "incorrectText"}>
                      <Box fontWeight={"fontWeightBold"}>Average: <CountUp start={0} end={average} duration={2.5}/>%</Box>
                    </Typography>
                  </Grid>
                  : <span></span>}
              {this.state.attempts.length !== 0
                  ?
                  <Grid item >
                    <Typography variant='h6' color='primary'>
                      <Box fontWeight="fontWeightBold">Attempts: {this.props.quiz.overall.attemptCnt}</Box>
                    </Typography>
                  </Grid>
                  : <span></span>}
            </Grid>
          </Grid>
          </Grid>
            <div style={{margin: "3%"}}>
              {this.chart()}
            </div>
          {this.state.attempts.length !== 0 && <Typography variant ='h5' color='primary' style={{marginLeft: "3%"}}>
              <Box fontWeight={"fontWeightBold"}>Most Missed Questions:</Box>
            </Typography>}
            <Grid container spacing={3} style={{margin:"3%"}}>
              {this.mostMissed()}
            </Grid>
            {this.state.attempts.length !== 0 && <Typography variant ='h5' color='primary' style={{marginLeft: "3%"}}>
              <Box fontWeight={"fontWeightBold"}>Recent Attempts:</Box>
            </Typography>}
        <Grid container spacing={3} style={{margin: "3%"}}>
            {this.attempts()}
        </Grid>
      </div>
    )
  }

  chart() {
    if(this.state.attempts.length > 1) {
      return (
        <div style={{marginTop: "15px"}}>
        <Typography variant='h5' color="primary">
          <Box fontWeight="fontWeightBold">Score Chart:</Box>
        </Typography>
        <Line data={{
          labels: this.state.attempts.reverse().map((atmpt:Attempt) => atmpt.time.toDate().toLocaleString()),
          datasets: [{
            data: this.state.attempts.map((atmpt: Attempt) => atmpt.grade),
            label: "Percent",
            borderColor: "#0d47a1",
            backgroundColor: "rgba(13, 71, 161, .5)",
            fill: true
          }]
        }} />
        </div>
      )
    }
  }

  mostMissed() : JSX.Element[] {
    let result : JSX.Element[] = [];
    if (this.state.attempts.length) {
      let quiz : QuizStats = this.props.quiz;
        for (let i = 0; i < Math.min(MISSED, this.state.sortedMissed.length); i++) {
          if (!this.state.indicesMap.get(this.state.sortedMissed[i])) {
            if(i === 0) {
              result.push(
                <Grid item component={Card} xs={12} sm={12} md={12} className="correctCard">
                  <CardContent>
                    <Typography variant='h6' color='primary'>
                      <Box fontWeight="fontWeightBold">You Haven't Missed Any Questions! Keep Up the Good Work!</Box>
                    </Typography>
                  </CardContent>
                </Grid>
              )
            }
            break;
          }
          result.push(
            <Grid item component={Card} xs={12} sm={12} md={3} className={"incorrectCard"}>
              <CardContent>
                <Typography variant='h6'className="incorrectText">
                  <Box fontWeight='fontWeightBold'>Question {this.state.sortedMissed[i] + 1}:</Box>
                </Typography>
                <Typography variant='body1' className='incorrectText'>
                  <Box fontWeight="fontWeightBold">
                    {quiz.type === "MSA" ?
                                        quiz.questions[this.state.sortedMissed[i]].title

                                      : quiz.questions[this.state.sortedMissed[i]].prompts}
                  </Box>
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body1" className="incorrectText">
                  <Box fontWeight={"fontWeightBold"}>Missed on {this.state.indicesMap.get(this.state.sortedMissed[i])}/{quiz.overall.attemptCnt} Attempts</Box>
                </Typography>
              </CardContent>
            </Grid>
          )
        }
    }
    return result;
  }


  attempts() : JSX.Element | JSX.Element[] {
    let quiz : QuizStats = this.props.quiz;

    let result = [];
    for (let i = 0; i < Math.min(ATTEMPTS, this.state.attempts.length); i++) {

      let val : Attempt = this.state.attempts[i];

      result.push(
        <Grid item component={Card} xs={12} md={12} sm={12} className={val.grade >= 80 ? 'correctCard' : 'incorrectCard'}>
        <CardContent>
          <Typography variant="h6" color="primary">
            <Box fontWeight="fontWeightBold">Attempt on {val.time.toDate().toLocaleString()}</Box>
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant='h6' className={val.grade >= 80 ? 'correctText' : 'incorrectText'}>
            <Box fontWeight='fontWeightBold'>Grade: <CountUp start={0} end={val.grade} duration={2.5}/>%</Box>
          </Typography>
          <Typography variant='h6' className={val.incorrectIndex.length ? "incorrectText" : "correctText"}><Box fontWeight="fontWeightBold">Questions Missed:</Box></Typography>
          <Typography variant='body1' style={{marginLeft: "5%"}} className={val.incorrectIndex.length ? "incorrectText" : "correctText"}>
            {val.incorrectIndex.length ? val.incorrectIndex.map(idx => <Box>Question {idx + 1}</Box>)
                                       : <Box>None, great job!</Box>}
          </Typography>
        </CardContent>
      </Grid>
      )
    }

    return result.length ? result : <Typography variant='h5' color="primary" style={{marginLeft: "45%"}}>
                                            <Box fontWeight="fontWeightBold">
                                              No Results
                                            </Box>
                                          </Typography>;
  }
}