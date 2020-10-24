import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyBidT6iSA4I0qe2WqyniqCyU5i_sb3uAos",
	authDomain: "instagram-demo-clone.firebaseapp.com",
	databaseURL: "https://instagram-demo-clone.firebaseio.com",
	projectId: "instagram-demo-clone",
	storageBucket: "instagram-demo-clone.appspot.com",
	messagingSenderId: "697259998231",
	appId: "1:697259998231:web:b65ae22b509dc405d5b052",
	measurementId: "G-E1TPESG97N" 
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};