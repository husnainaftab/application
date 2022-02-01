import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

// add firebase config
const firebaseConfig = {
	apiKey: Constants.manifest.extra.apiKey,
	authDomain: Constants.manifest.extra.authDomain,
	projectId: Constants.manifest.extra.projectId,
	storageBucket: Constants.manifest.extra.storageBucket,
	messagingSenderId: Constants.manifest.extra.messagingSenderId,
	appId: Constants.manifest.extra.appId,
	databaseURL: Constants.manifest.extra.databaseURL,
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = getAuth();

const firestoreDb = getFirestore(app);

console.log(firebaseConfig);

export { auth, firestoreDb };
