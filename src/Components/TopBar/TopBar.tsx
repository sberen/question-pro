import React from 'react';
import {Button, AppBar, Toolbar, Typography} from '@material-ui/core';
import'./TopBar.css';

interface TopBarProps {
  onQuizClick : () => any;
}

export class TopBar extends React.Component<TopBarProps, {}> {
  render() {
    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
              <Typography variant="h5" id="header">Question Pro</Typography>
            <Button variant='text' color='secondary' onClick={() => this.props.onQuizClick()}>Quizzes</Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}