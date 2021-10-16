import React, { useContext, useEffect, useState } from "react";
import { db } from "../Context/firebase";
import Canvas from "../Canvas/CanvasContext";
import userContext from "../Context/userContext";
import firebase from "firebase";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
import "./Room.css";
import StudentLeftSideBar from "../LeftSideBars/StudentLeftSideBar";
import TutorLeftSideBar from "../LeftSideBars/TutorLeftSideBar";

export default function Room() {
	const history = useHistory();
	const [roomID, setRoomID] = useState("");
	const [showCanvas, setShowCanvas] = useState(false);
	const [subjects, setSubjects] = useState([]);
	const [subject, setSubject] = useState(null); // to choose a subject
	const [schedule, setSchedule] = useState([]);

	const { user, userData, setGlobalRoomID, logout, isTutor, isAdmin } =
		useContext(userContext);

	if (!user) history.push("/");

	useEffect(() => {
		if (!userData) {
			history.push("/");
		} else if (userData && !userData.userRole) {
			history.push("/");
		}
	}, [userData, history]);

	useEffect(() => {
		db.collection("subjects")
			.get()
			.then((snap) => {
				setSubjects(snap.docs.map((doc) => doc.data()));
			});
		const end = db
			.collection("students")
			.doc(user?.uid)
			.onSnapshot((doc) => {
				setRoomID(doc.data()?.currentRoomID);
				if (doc.data()?.currentRoomID) setShowCanvas(true);
				if (doc.data()?.currentRoomID === null) {
					setShowCanvas(false);
					setRoomID("");
				}
			});
		return end;
	}, [user]);

	useEffect(() => {
		if (!isTutor) return;
		db.collection("tutors")
			.doc(user.uid)
			.collection("schedule")
			.onSnapshot((snap) => {
				setSchedule(snap.docs);
			});
	}, []);

	const leaveRoom = () => {
		if (isTutor) {
			setRoomID("");
			setShowCanvas(false);
		} else {
			db.collection("students").doc(user.uid).update({ currentRoomID: null });
		}
		if (isAdmin) {
			setRoomID("");
			setShowCanvas(false);
		}
	};

	const findRoom = () => {
		if (subject) {
			db.collection("tutors")
				.where("subjects", "array-contains", subject)
				.get()
				.then((snap) => {
					snap.docs.every((doc) => {
						// if a tutor has no active students
						if (!doc.data().currentNumberOfStudents && doc.data().isOnline) {
							db.collection(`tutors/${doc.data().uid}/requestToJoin`).add({
								requestedAt: Date.now(),
								email: user.email,
								uid: user.uid,
								ID: userData.ID,
							});
							return false; // break out of the loop
						}
						return true; // to keep looping
					});
					const sortedTutors = snap.docs.sort((a, b) => {
						const aCount = a.data().currentNumberOfStudents;
						const bCount = b.data().currentNumberOfStudents;

						return aCount - bCount;
					});

					let doc = null;
					for (let d of sortedTutors) if (d.data().isOnline) doc = d; // tutor with minumum number of students
					console.log(doc.data());
					if (!doc) {
						alert("No tutors available at the moment");
						return;
					}

					doc.ref
						.collection("requestToJoin")
						.add({
							requestedAt: Date.now(),
							email: user.phoneNumber, // change the field to ph no or email
							uid: user.uid,
							ID: userData.ID,
						})
						.then((d) => console.log(d));
				});
		} else {
			alert("Select a subject!");
			return;
			// if (roomID.trim() === "") return;

			// db.collection("rooms")
			// 	.doc(roomID)
			// 	.get()
			// 	.then((doc) => {
			// 		if (doc.exists) {
			// 			setShowCanvas(true);
			// 			setGlobalRoomID(roomID);
			// 			if (!isTutor)
			// 				db.collection("students")
			// 					.doc(user.uid)
			// 					.update({ currentRoomID: roomID });
			// 		}
			// 		if (!doc.exists) alert(`Room with ID: ${roomID} does not exist`);
			// 	});
		}
	};

	const createRoom = () => {
		const roomID = uuid().substr(0, 5);
		db.collection("rooms").doc(roomID).set({
			id: roomID,
		});
		return roomID;
	};
	console.log(user.uid);
	useEffect(() => {
		if (!user || !isTutor) return;
		const end = db
			.collection("tutors")
			.doc(user.uid)
			.collection("requestToJoin")
			.onSnapshot((snap) => {
				snap.docs.forEach((doc) => {
					console.log("alert");
					const accept = window.confirm(
						doc.data().email + " has requested to join"
					);
					if (accept) {
						const roomID = createRoom();
						db.collection("students")
							.doc(doc.data().uid)
							.update({ currentRoomID: roomID });
						db.collection("tutors")
							.doc(user.uid)
							.collection("currentStudents")
							.doc(doc.data().uid)
							.set({ ...doc.data(), roomID });
						db.collection("tutors")
							.doc(user.uid)
							.update({
								currentNumberOfStudents:
									firebase.firestore.FieldValue.increment(1),
							});
					}
					doc.ref.delete();
				});
			});
		return end;
	}, [isTutor, user]);

	const enterRoom = () => {
		if (!subject) {
			alert("Select a subject!");
			return;
		}
		const room = createRoom();
		setRoomID(room);
		setShowCanvas(true);
		if (!isTutor)
			db.collection("students").doc(user.uid).update({ currentRoomID: room });
	};

	return showCanvas ? (
		<div id="whiteboard">
			<Canvas
				roomID={roomID}
				leaveRoom={leaveRoom}
				setRoomID={setRoomID}
				requestToJoin={findRoom}
			/>
		</div>
	) : (
		<>
			{userData.userRole === "student" ? (
				<StudentLeftSideBar appBarHeading="Rooms" />
			) : (
				<TutorLeftSideBar appBarHeading="Rooms" />
			)}
			<div className="homeMain">
				<hr />
				<div className="homeContainer">
					<div className="roomDiv">
						<h1>Room</h1>

						{isTutor && (
							<button
								className="homeBtn"
								onClick={(e) => {
									e.preventDefault();
									const room = createRoom();
									setRoomID(room);
									setShowCanvas(true);
									if (!isTutor)
										db.collection("students")
											.doc(user.uid)
											.update({ currentRoomID: room });
								}}
							>
								Join Whiteboard
							</button>
						)}

						{subjects.length !== 0 && !isTutor && (
							<>
								<select
									onChange={(e) => {
										setSubject(e.target.value);
										setRoomID("");
									}}
									value={subject}
								>
									<option value={null} selected={subject === null}>
										Choose a subject
									</option>
									{subjects.map((sub) => (
										<option value={sub.name}>{sub.name}</option>
									))}
								</select>
								<button className="homeBtn" onClick={enterRoom}>
									Enter Whiteboard
								</button>
							</>
						)}

						<button className="homeBtn" onClick={logout}>
							Logout
						</button>
					</div>
					{isTutor && (
						<div className="scheduleDiv">
							<h1>Schedule</h1>
							<hr />
							{schedule.map((doc) => (
								<div>
									{new Date(doc.data().scheduledTime).toLocaleString()}
									<button
										onClick={(e) => {
											e.preventDefault();
											if (doc.data().scheduledTime - 600000 > Date.now()) {
												alert(
													"You can join 10 minutes prior to the scheduled time"
												);
												return;
											}
											const room = createRoom();
											setRoomID(room);
											setShowCanvas(true);
											// TODO: add to the logs that the tutor has joined on time
										}}
									>
										Join
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
