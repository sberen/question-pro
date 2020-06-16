import 'firebase/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';

const FIREBASECONFIG = {
    apiKey: "AIzaSyBVtbyerfW6d_477bvl1ffMj1Wez75cakg",
    authDomain: "questionpro-65223.firebaseapp.com",
    databaseURL: "https://questionpro-65223.firebaseio.com",
    projectId: "questionpro-65223",
    storageBucket: "questionpro-65223.appspot.com",
    messagingSenderId: "880645784876",
    appId: "1:880645784876:web:c0aee748808ff73ab65889",
    measurementId: "G-S6W8V13Y0E"
};

firebase.initializeApp(FIREBASECONFIG);

export const auth : firebase.auth.Auth = firebase.auth();

export const firestore : firebase.firestore.Firestore = firebase.firestore();

export const firebaseUIConfig = {
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ], 
    Callbacks: {
        signInSuccessfulWithAuthResult: () => false
    }
}