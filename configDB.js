import * as firebase from 'firebase'
import 'firebase/database'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCe-7HpyOTq1--UoCFAheO8PG-UOxM4AOg",
    authDomain: "ump-driver.firebaseapp.com",
    databaseURL: "https://ump-driver.firebaseio.com",
    projectId: "ump-driver",
    storageBucket: "ump-driver.appspot.com",
    messagingSenderId: "703385100294",
    appId: "1:703385100294:web:2b2b9cc3333a211e72e387",
    measurementId: "G-FXLWK5XJLH"
  };

  let firebases; 
  if (!firebase.apps.length) {
    firebases = firebase.initializeApp(firebaseConfig);
 }
  export const database= firebase.database()
  export const auth= firebase.auth()
  export default firebases