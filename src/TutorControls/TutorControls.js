import React, { useContext, useEffect, useRef, useState } from "react";
import { db } from "../Context/firebase";
import userContext from "../Context/userContext";
import "./style.css";
import firebase from "firebase";

export default function TutorControls({ back, setRoomID }) {
	const mainRef = useRef();
	const [students, setStudents] = useState([]);
	const [online, setOnline] = useState(false);

	const { user } = useContext(userContext);

	useEffect(() => {
		mainRef.current.classList.add("tutorCtrlVisible");
		db.collection("tutors")
			.doc(user.uid)
			.collection("currentStudents")
			.onSnapshot((snap) => {
				setStudents(snap.docs.map((doc) => doc));
			});
		db.collection("tutors")
			.doc(user.uid)
			.get()
			.then((doc) => setOnline(doc.data().isOnline));
	}, [user]);

	const removeStudent = (s) => {
		db.collection("students").doc(s.data().uid).update({ currentRoomID: null });
		db.collection("tutors")
			.doc(user.uid)
			.update({
				currentNumberOfStudents: firebase.firestore.FieldValue.increment(-1),
			});
		s.ref.delete();
	};

	const toggleOnline = () => {
		db.collection("tutors").doc(user.uid).update({ isOnline: !online });
		setOnline((p) => !p);
	};

	return (
		<div className="tutorCtrl" ref={mainRef}>
			<h1 style={{ textAlign: "center" }}>Tutor Controls</h1>
			<hr />
			<button onClick={back}>Close</button>
			<button onClick={toggleOnline}>Go {online ? "Offline" : "Online"}</button>
			<ol>
				{students.map((s) => (
					<li
						style={{
							display: "flex",
							justifyContent: "space-around",
							alignItems: "center",
							borderBottom: "1px solid black",
							width: "90%",
						}}
					>
						<h3>{s.data().email}</h3>
						<button onClick={() => setRoomID(s.data().roomID)}>Switch</button>
						<button onClick={() => removeStudent(s)}>Remove</button>
					</li>
				))}
			</ol>
		</div>
	);
}
