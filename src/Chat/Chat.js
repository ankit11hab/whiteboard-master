import React, { useContext, useEffect, useState } from "react";
import { db } from "../Context/firebase";
import userContext from "../Context/userContext";
import "./style.css";

export default function Chat({ roomID }) {
	const [messages, setMessages] = useState([]);
	const [newMsg, setNewMsg] = useState("");
	const [sending, setSending] = useState(false);

	const { user } = useContext(userContext);

	useEffect(() => {
		if (!roomID) return;
		const end = db
			.collection("rooms")
			.doc(roomID)
			.collection("chats")
			.orderBy("sentAt")
			.onSnapshot((snap) => {
				setMessages(snap.docs);
			});
		return end;
	}, [roomID]);

	const send = (e) => {
		e.preventDefault();
		if (newMsg.trim() === "" || sending) return;
		setSending(true);
		db.collection(`rooms/${roomID}/chats`)
			.add({
				message: newMsg,
				sentAt: Date.now(),
				sentBy: user.uid,
			})
			.then(() => {
				setNewMsg("");
				setSending(false);
			});
	};

	return (
		<div className="chatContainer">
			{messages.length === 0 && (
				<p style={{ textAlign: "center" }}>
					This is the beginning of this chat
				</p>
			)}
			{messages.map((msg) =>
				msg.data().sentBy === user.uid ? (
					<p className="message byUs">{msg.data().message}</p>
				) : (
					<p className="message byThem">{msg.data().message}</p>
				)
			)}
			<form className="chatBottomBar" onSubmit={send}>
				<input
					type="text"
					value={newMsg}
					onChange={(e) => setNewMsg(e.target.value)}
					className="msgInput"
					placeholder="Type a message"
				/>
				<button type="submit" disabled={sending}>
					{">"}
				</button>
			</form>
		</div>
	);
}
