import firebase from 'firebase'

console.log(process.env.SENDER_ID)
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: "jurusuke3.firebaseapp.com",
    databaseURL: "https://jurusuke3.firebaseio.com",
    projectId: "jurusuke3",
    storageBucket: "jurusuke3.appspot.com",
    messagingSenderId: process.env.SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  })
}

export default firebase
