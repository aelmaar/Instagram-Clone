import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
	// your config her
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};