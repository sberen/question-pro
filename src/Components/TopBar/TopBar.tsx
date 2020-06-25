import React from 'react';
import { auth } from '../../firebase';
import {Button, AppBar, Toolbar, Typography} from '@material-ui/core';
import'./TopBar.css';

interface TopBarProps {
  onQuizClick : () => any;
  makeQuiz: () => any;
  onSignOut: () => any;
  user: any;
}

export class TopBar extends React.Component<TopBarProps, {}> {

  
  render() {
    return (
      <div>
        <AppBar position='fixed' style={{flexGrow: 1}}>
          <Toolbar>
            <Typography variant="h5" id="header" >Question Pro</Typography>
            <Button variant='text' color={"secondary"} onClick={() => this.props.onQuizClick()}>Quizzes</Button>
            <Button variant='text' color={"secondary"} onClick={() => this.props.makeQuiz()}>Add a Quiz</Button>
            <div style={{flexGrow: 1}}/>
            <div>
              {this.props.user && <Button variant='text' color='secondary' onClick={() => auth.signOut()}>Sign Out</Button>}
            </div>
          </Toolbar>
        </AppBar>
        <Toolbar style={{marginBottom: "10px"}}/>
      </div>
    )
  }
}