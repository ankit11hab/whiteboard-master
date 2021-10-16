import React, { useEffect, useState } from "react";
import { db } from "../Context/firebase";
import "./Map.css";
import firebase from "firebase";
import { v4 as uuid } from "uuid";
import { ArrowDownward } from "@material-ui/icons";
import AdminLeftSideBar from "../LeftSideBars/AdminLeftSideBar";

export default function Map() {
	const [students, setStudents] = useState([]);
	const [onlineTutors, setOnlineTutors] = useState([]);
	const [map, setMap] = useState({}); // this contains objects with tutor data and a list of students currently under that tutor

	useEffect(() => {
		const tutorListener = db.collection("tutors").onSnapshot((snap) => {
			setOnlineTutors(snap.docs.filter((doc) => doc.data().isOnline));
		});
		const studentListener = db.collection("students").onSnapshot((snap) => {
			setStudents(snap.docs.filter((d) => !d.data().currentRoomID));
		});
		let studentsListener = null;
		const mapListener = db.collection("tutors").onSnapshot((snap) => {
			snap.docs.map(async (doc) => {
				studentsListener = await db
					.collection("tutors")
					.doc(doc.data().uid)
					.collection("currentStudents")
					.onSnapshot((currentStudentsSnap) => {
						setMap((p) => ({
							...p,
							[doc.data().uid]: {
								...doc.data(),
								currentStudents: currentStudentsSnap.docs,
							},
						}));
					});
			});
		});
		return () => {
			tutorListener();
			studentListener();
			mapListener();
			if (studentsListener) studentsListener();
		};
	}, []);

	const createRoom = () => {
		const roomID = uuid().substr(0, 5);
		db.collection("rooms").doc(roomID).set({
			id: roomID,
		});
		return roomID;
	};

	return (
		<>
			<AdminLeftSideBar appBarHeading="Map" />
			<main>
				<div className="mapContainer">
					<div className="col">
						<h3 style={{ textAlign: "center",color:"#953333" ,fontFamily:"sans-serif" }}>Online Tutors</h3>
						<hr />
						{onlineTutors.map((tutor) => (
							<div draggable className="draggableDiv">
								<p>{tutor.data().email}</p>
							</div>
						))}
					</div>
					<div
						className="col"
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							const obj = JSON.parse(e.dataTransfer.getData("obj"));
							// remove the student from the current whiteboard
							if (obj.type !== "student") return;
							db.collection("tutors")
								.doc(obj.tutorUID)
								.collection("currentStudents")
								.doc(obj.uid)
								.delete();
							db.collection("students")
								.doc(obj.uid)
								.update({ currentRoomID: null });
							db.collection("tutors")
								.doc(obj.tutorUID)
								.update({
									currentNumberOfStudents:
										firebase.firestore.FieldValue.increment(-1),
								});
						}}
					>
						<h3 style={{ textAlign: "center",color:"#953333" ,fontFamily:"sans-serif" }}>Students</h3>
						<hr />
						{students.map(
							(student) =>
								student.ref.id !== "metadata" && (
									<div
										draggable
										className="draggableDiv"
										onDragStart={(e) => {
											const obj = JSON.stringify({
												...student.data(),
												type: "student",
											});
											e.dataTransfer.setData("obj", obj);
										}}
									>
										<p>{student.data().email || student.data().phone}</p>
									</div>
								)
						)}
					</div>
					<div className="col">
						<h3 style={{textAlign: "center",color:"#953333",fontFamily:"sans-serif" }}>Map</h3>
						<hr />
						{onlineTutors.map((tut) => {
							const data = map[tut.data().uid];
							if (!data) return <></>;
							return (
								<div
									className="mapObject"
									onDragOver={(e) => {
										e.preventDefault();
									}}
									onDrop={(e) => {
										const obj = JSON.parse(e.dataTransfer.getData("obj"));
										const roomID = createRoom();
										// add the student to current students list
										db.collection("tutors")
											.doc(data.uid)
											.update({
												currentNumberOfStudents:
													firebase.firestore.FieldValue.increment(1),
											});
										db.collection(`tutors/${data.uid}/currentStudents`)
											.doc(obj.uid)
											.set({
												email: obj.phone,
												uid: obj.uid,
												requestedAt: Date.now(),
												roomID,
												ID: obj.ID,
											});
										db.collection("students")
											.doc(obj.uid)
											.update({ currentRoomID: roomID });
									}}
								>
									<div draggable className="draggableDiv mapTutorDiv">
										{data.email}
									</div>
									{data?.currentStudents.length > 0 && (
										<span style={{ alignSelf: "center", marginLeft: "45%" }}>
											<ArrowDownward />
										</span>
									)}
									{data.currentStudents.map((student, index) => (
										<>
											<li
												draggable
												className="draggableDiv mapStudentDiv"
												onDragStart={(e) => {
													e.dataTransfer.setData(
														"obj",
														JSON.stringify({
															...student.data(),
															type: "student",
															tutorUID: data.uid,
														})
													);
												}}
											>
												{student.data().email}
											</li>
											{data?.currentStudents.length - 1 !== index && (
												<span
													style={{ alignSelf: "center", marginLeft: "45%" }}
												>
													<ArrowDownward />
												</span>
											)}
										</>
									))}
								</div>
							);
						})}
					</div>
				</div>
			</main>
		</>
	);
}
