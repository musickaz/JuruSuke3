import firebase from "firebase"

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBqmswu5Y5RwZhYxAJAy0HN9MpHwDr2Eq4",
    authDomain: "jurusuke3.firebaseapp.com",
    databaseURL: "https://jurusuke3.firebaseio.com",
    projectId: "jurusuke3",
    storageBucket: "jurusuke3.appspot.com",
    messagingSenderId: "711610852916",
    appId: "1:711610852916:web:f6a77d7e96ececb5ec8c61",
    measurementId: "G-WBSMR8TWT0"
  })
}

export default firebase
