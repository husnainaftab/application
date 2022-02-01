import {
	collection,
	doc,
	getDocs,
	orderBy,
	query,
	setDoc,
} from "firebase/firestore/lite";
import uuid from "react-native-uuid";
import { firestoreDb } from "../config/firebase";

export const getSavedReports = (user) => {
	const savedReportsRef = collection(
		firestoreDb,
		"saved-reports",
		user.uid,
		"d"
	);
	let q = query(savedReportsRef, orderBy("createdAt", "desc"));
	return getDocs(q).then((r) => r.docs.map((doc) => doc.data()));
};

export const setSavedReport = (user, data = {}) => {
	const savedReportsRef = doc(
		firestoreDb,
		"saved-reports",
		user.uid,
		"d",
		uuid.v1()
	);
	return setDoc(savedReportsRef, {
		...data,
		createdAt: Math.floor(new Date().getTime() / 1000),
	});
};
