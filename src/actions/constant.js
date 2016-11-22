import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyD6aYi3Mi4e4dKPNsBt0Mr58IupAqzMF-c',
  authDomain: 'saung.firebaseapp.com',
  databaseURL: 'https://saung.firebaseio.com',
  storageBucket: 'project-2672340983981475567.appspot.com',
};

firebase.initializeApp(config);
export const firebaseConfig = config;
export const firebaseRef = firebase.database().ref();
