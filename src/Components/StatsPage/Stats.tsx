import React from 'react';
import { QuizStats, Attempt } from './QuizStats';
import { Grid, Card, CardContent, Typography, Box } from'@material-ui/core';
import CountUp from 'react-countup';
import '../Quiz/QuestionHandler/ResultsPage.css';

interface StatsProps {
  quiz: QuizStats;
}

export class Stats extends React.Component<StatsProps, {}> {

  render() {

    let attempts: Attempt[] = Object.keys(this.props.quiz.attempts).map((val) => (
                                                                       {
                                                                        incorrectIndex: this.props.quiz.attempts[val].incorrectIndex,
                                                                        time: this.props.quiz.attempts[val].time
                                                                      }));

    attempts.sort((a,b) => b.time.toMillis() - a.time.toMillis() )

    let totalQs : number = this.props.quiz.overall.attemptCnt * this.props.quiz.wrongQCount.length;
    let average : number = Math.round(100 * ((totalQs - this.props.quiz.overall.wrongCnt) / totalQs));

    let name : string = attempts.length && average >= 80 ? "goodTitle" : (attempts.length ? "badTitle" : "card")

    return (
      <Grid container spacing={3}> 
        <Grid container component={Card} xs={12} md={12} sm={12} className={name}>
          <CardContent>
            <Typography variant='h5' color='primary'>
              <Box fontWeight={"fontWeightBold"}>{this.props.quiz.name}</Box>
            </Typography>
          </CardContent>
          {attempts.length !== 0 
          ?
          <CardContent>
            <Typography variant='h6' className={average >= 80 ? "correctText" : "incorrectText"}>
              <Box fontWeight={"fontWeightBold"}>Average: <CountUp start={0} end={average} duration={2.5}/>%</Box>
            </Typography>
          </CardContent>
          : <span></span>}
        </Grid>
        {attempts.map((val) => {

          let grade = Math.round(100*((this.props.quiz.wrongQCount.length - val.incorrectIndex.length) / this.props.quiz.wrongQCount.length));
          
          return (
          <Grid item component={Card} xs={12} md={12} sm={12} className={grade >= 80 ? 'correctCard' : 'incorrectCard'}>
            <CardContent>
              <Typography variant="h6" color="primary">
                <Box fontWeight="fontWeightBold">Attempt from {val.time.toDate().toLocaleString()}</Box>
              </Typography>
            </CardContent>
            <CardContent>
              <Typography variant='h6' className={grade >= 80 ? 'correctText' : 'incorrectText'}>
                <Box fontWeight='fontWeightBold'>Grade: <CountUp start={0} end={grade} duration={2.5}/>%</Box>
              </Typography>
            </CardContent>
          </Grid>
        )})}
        {attempts.length === 0 && <Typography variant='h5' color="primary" style={{marginLeft: "50%"}}><Box fontWeight="fontWeightBold">No Results</Box></Typography>}
      </Grid>)
  }
}