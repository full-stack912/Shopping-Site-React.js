import * as firebase from "firebase/app";
import "firebase/messaging";

const initializedFirebaseApp = firebase.initializeApp({
  messagingSenderId: "427826178089",
  projectId: "zendas-1567043550017",
  apiKey: "AIzaSyAzoX9ReFTPQbJzvLDWrcPTwBzkdYgtcbM",
  authDomain: "zendas-1567043550017.firebaseapp.com",
  databaseURL: "https://zendas-1567043550017.firebaseio.com",

  storageBucket: "zendas-1567043550017.appspot.com",
  appId: "1:427826178089:web:3aa58e1e837139eddc1438",
  measurementId: "G-BFWY321VG3"
});

const messaging = initializedFirebaseApp.messaging();

messaging.usePublicVapidKey(
  "BF2WRhcff8DY0XdgiuYwpfLgu2ZY8jDRTiRqPTcSNssDcUgIGA0ah-NVTYqIKoRsSz2N-n2gPR0DlyJXa18Y0MI"
);

export { messaging , initializedFirebaseApp};
