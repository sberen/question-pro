import React from 'react';
import { QuizStats, Attempt } from './QuizStats';
import { Grid, Card, CardContent, Typography, Box } from'@material-ui/core';
import CountUp from 'react-countup';
import '../Quiz/QuestionHandler/ResultsPage.css';

const ATTEMPTS : number = 5;
const MISSED : number = 3;

interface StatsProps {
  quiz: QuizStats;
}

interface StatsState {
  attempts: Attempt[];
}

export class Stats extends React.Component<StatsProps, StatsState> {

  constructor(props: StatsProps) {
    super(props);

    let attempts: Attempt[] = Object.keys(this.props.quiz.attempts).map((val) => (
      {
       incorrectIndex: this.props.quiz.attempts[val].incorrectIndex,
       time: this.props.quiz.attempts[val].time
     }));

    attempts.sort((a,b) => b.time.toMillis() - a.time.toMillis());

    this.state = {
      attempts: attempts
    }
  }

  render() {

    let totalQs : number = this.props.quiz.overall.attemptCnt * this.props.quiz.wrongQCount.length;
    let average : number = Math.round(100 * ((totalQs - this.props.quiz.overall.wrongCnt) / totalQs));

    let name : string = this.state.attempts.length && average >= 80 ? "goodTitle" : (this.state.attempts.length ? "badTitle" : "card")

    return (
      <div>
        <Grid container spacing={3}> 
          <Grid container component={Card} xs={12} md={12} sm={12} className={name}>
            <CardContent>
              <Typography variant='h5' color='primary'>
                <Box fontWeight={"fontWeightBold"}>{this.props.quiz.name}</Box>
              </Typography>
            </CardContent>
            {this.state.attempts.length !== 0 
                  ?
                  <CardContent>
                    <Typography variant='h6' className={average >= 80 ? "correctText" : "incorrectText"}>
                      <Box fontWeight={"fontWeightBold"}>Average: <CountUp start={0} end={average} duration={2.5}/>%</Box>
                    </Typography>
                  </CardContent>
                  : <span></span>}
          </Grid>
          {this.attempts()}
        </Grid>
        <div>
          {this.chart()}
        </div>
        {this.mostMissed()}
      </div>
    )
  }

  chart() {
    return <div></div>;
  }

  mostMissed() {
    let result = [];
    if (this.state.attempts.length) {
        let wrong : number[] = this.props.quiz.wrongQCount;
        for (let i = 0; i < Math.min(MISSED, wrong.length); i++) {
          if (!wrong[i]) break;
          
        }
    }
  }
  

  attempts() : JSX.Element | JSX.Element[] {
    let quiz : QuizStats = this.props.quiz;

    let result = [];
    for (let i = 0; i < Math.min(ATTEMPTS, this.state.attempts.length); i++) {
      let val = this.state.attempts[i];
      let grade = Math.round(100*((quiz.wrongQCount.length - val.incorrectIndex.length) / quiz.wrongQCount.length));

      result.push(
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
      )
    }

    return result.length ? result : <Typography variant='h5' color="primary" style={{marginLeft: "50%"}}>
                                            <Box fontWeight="fontWeightBold">
                                              No Results
                                            </Box>
                                          </Typography>;
  }
}