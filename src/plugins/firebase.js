import Vue from 'vue'
import firebase from 'firebase/app';
import "firebase/auth";
import 'firebase/firestore';
import 'firebase/storage';
import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)

export const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD1dySNzWlBMEHKsLvoNMTEG0ROgpwSfdM",
    authDomain: "encounter-6f99c.firebaseapp.com",
    databaseURL: "https://encounter-6f99c.firebaseio.com",
    projectId: "encounter-6f99c",
    storageBucket: "encounter-6f99c.appspot.com",
    messagingSenderId: "237785236632",
    appId: "1:237785236632:web:b15efd85245e7a4e553ced",
    measurementId: "G-R4N16QNC80"
  });

export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const storage = firebaseApp.storage();