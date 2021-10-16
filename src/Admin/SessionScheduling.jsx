import React, { useEffect, useState } from "react";
import { db } from "../Context/firebase";
import AdminLeftSideBar from "../LeftSideBars/AdminLeftSideBar";
import "./SessionScheduling.css";

export default function SessionScheduling() {
	const [tutors, setTutors] = useState([]);
	const [time, setTime] = useState({}); // object contains uid: time properties
	const [selectedTutors, setSelectedTutors] = useState([]);

	useEffect(() => {
		db.collection("tutors")
			.get()
			.then((snap) => {
				setTutors(snap.docs);
			});
	}, []);

	const schedule = (tutor) => {
		if (!time[tutor.data().uid]) return;
		const tempDate = time[tutor.data().uid];
		const trueTime = new Date(
			tempDate.slice(0, 4),
			+tempDate.slice(5, 7) - 1,
			tempDate.slice(8, 10),
			tempDate.slice(11, 13),
			tempDate.slice(14, 16)
		).getTime();
		if (selectedTutors.length === 0) {
			tutor.ref
				.collection("schedule")
				.add({
					scheduledTime: trueTime,
				})
				.then(() => {
					alert("Added a new schedule for tutor " + tutor.data().email);
					setTime((p) => ({ ...p, [tutor.data().uid]: "" }));
				});
		} else {
			selectedTutors.forEach((tutor, index) => {
				tutor.ref
					.collection("schedule")
					.add({
						scheduledTime: trueTime,
					})
					.then(() => {
						setTime((p) => ({ ...p, [tutor.data().uid]: "" }));
						if (index === selectedTutors.length - 1)
							alert("Updated schedules for " + (index + 1) + " tutors");
					});
			});
		}
	};

	return (
		<>
			<AdminLeftSideBar appBarHeading={`Session Scheduling`} />
			<main>
				<div className="scheduleMain">
					{tutors.map((tutor, index) => (
						<div className="scheduleTutor" key={index}>
							<input
								type="checkbox"
								onChange={(e) => {
									const checked = e.target.checked;
									if (checked) {
										setSelectedTutors((p) => [...p, tutor]);
									} else {
										setSelectedTutors(
											selectedTutors.filter((t) => t !== tutor)
										);
									}
								}}
							/>
							<h3>{tutor.data().email}</h3>
							<input
								type="datetime-local"
								value={time[tutor.data().uid]}
								
								onChange={(e) => {
									e.persist();
									setTime((p) => ({
										...p,
										[tutor.data().uid]: e.target.value,
									}));
								}}
							/>
							<button onClick={() => schedule(tutor)}>SCHEDULE</button>
						</div>
					))}
				</div>
			</main>
		</>
	);
}
