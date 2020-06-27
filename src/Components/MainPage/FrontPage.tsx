import React from 'react';
import { auth, firebaseUIConfig } from '../../firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Card, CardContent, Typography, Box } from '@material-ui/core';
import "./FrontPage.css";

// this component is the landing page upon
// arriving to the website, giving users the
// opportunity to sign in
export function FrontPage() {
  return (
    <Card className="frontCard">
      <CardContent>
        <Typography variant='h6' color='primary' className="title">
          <Box fontWeight="fontWeightBold">Welcome to Question Pro!</Box> 
        </Typography>
        <Typography variant='body1' color='primary' className="title">
          <Box>Please sign in below:</Box>
        </Typography>
        <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
      </CardContent>
    </Card>
  )
}