import React from 'react';
import { MainPage }  from './Components/MainPage/MainPage'
import {Theme, createMuiTheme, ThemeProvider} from '@material-ui/core';
import { green } from '@material-ui/core/colors';

const theme : Theme = createMuiTheme({
  typography: {
    fontFamily: 'Helvetica'
  },
  palette: {
    primary: green,
    secondary: {
      main: "#fafafa"
    }
  }
});


export class App extends React.Component {
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <MainPage />
        </ThemeProvider>
      </div>  
    );
  }

}

