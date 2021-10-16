import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBfcit7nYUw1Tet5esRiLnoFofG2TAD7aQ",
	authDomain: "mmmwhiteboard.firebaseapp.com",
	projectId: "mmmwhiteboard",
	storageBucket: "mmmwhiteboard.appspot.com",
	messagingSenderId: "908237071100",
	appId: "1:908237071100:web:b21b8d692173f16a44ad79",
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const db = app.firestore();
export const storage = app.storage();
