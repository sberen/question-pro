import React from 'react';
import { auth, firebaseUIConfig } from '../../firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Card, CardContent, CardActions, Typography, Box } from '@material-ui/core';
import "./FrontPage.css";

export function FrontPage() {
  return (
    <Card className="frontCard">
      <CardContent>
        <Typography variant='h6' color='primary' className="title">
          <Box fontWeight="fontWeightBold">Welcome to Question Pro!</Box> 
        </Typography>
        <Typography variant='body1' color='primary' className="title">
          <Box>Please Sign in with one of the providers below:</Box>
        </Typography>
        <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
      </CardContent>
    </Card>
  )
}