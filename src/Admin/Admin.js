import React, { useEffect, useState } from "react";
import { auth, db } from "../Context/firebase";
import { v4 as uuid } from "uuid";
import "./Admin.css";
import Canvas from "../Canvas/CanvasContext";
import Map from "./Map";

export default function Admin() {
	const [rooms, setRooms] = useState([]);
	const [showCanvas, setShowCanvas] = useState(false);
	const [roomID, setRoomID] = useState("");
	const [display, setDisplay] = useState("map");

	const createRoom = () => {
		const roomID = uuid().substr(0, 5);
		db.collection("rooms").doc(roomID).set({
			id: roomID,
		});
	};

	const deleteRoom = (id) => {
		if (window.confirm("Are you sure you want to delete this room?"))
			db.collection("rooms").doc(id).delete();
	};

	const enterRoom = (id) => {
		setShowCanvas(true);
		setRoomID(id);
	};

	useEffect(() => {
		db.collection("rooms").onSnapshot((snap) => {
			setRooms(snap.docs.map((doc) => doc.data()));
		});
	}, []);

	const leaveRoom = () => {
		setRoomID("");
		setShowCanvas(false);
	};

	return showCanvas ? (
		<Canvas roomID={roomID} leaveRoom={leaveRoom} />
	) : (
		<div className="adminMain">
			<div className="leftNav">
				<h1 style={{ textAlign: "center" }}>Admin</h1>
				<hr />
				<button className="adminNavBtn" onClick={() => setDisplay("rooms")}>
					Rooms
				</button>
				<button className="adminNavBtn" onClick={createRoom}>
					Create Room
				</button>
				<button className="adminNavBtn" onClick={() => setDisplay("map")}>
					Map
				</button>
				<button className="adminNavBtn" onClick={() => auth.signOut()}>
					Logout
				</button>
			</div>
			<div className="adminDisplayContainer">
				{display === "rooms" && (
					<div className="rooms">
						{rooms.map((room) => (
							<div className="room">
								<h3>
									Room ID:
									<br /> {room.id}
								</h3>
								<button
									className="btn-canvasTool"
									onClick={() => enterRoom(room.id)}
								>
									Enter
								</button>
								<button
									className="btn-canvasTool"
									onClick={() => deleteRoom(room.id)}
								>
									Delete
								</button>
							</div>
						))}
					</div>
				)}
				{display === "map" && <Map />}
			</div>
		</div>
	);
}
