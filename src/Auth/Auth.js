import React, { useEffect, useState } from "react";
import "./Auth.css";
import { auth, db } from "../Context/firebase";

export default function Auth() {
	const [display, setDisplay] = useState("login");

	return (
		<div className="authMain">
			<div className="auth">
				<div className="switchAuth">
					<button
						className="btn-primary switchAuthBtn "
						onClick={() => setDisplay("login")}
					>
						Login
					</button>
					<button
						className="btn-primary switchAuthBtn "
						onClick={() => setDisplay("register")}
					>
						Sign up
					</button>
				</div>
				{display === "login" && <Login />}
				{display === "register" && <Signup />}
			</div>
		</div>
	);
}

function Login() {
	const [email, setEmail] = useState("");
	const [pwd, setPwd] = useState("");

	const login = (e) => {
		e.preventDefault();

		auth.signInWithEmailAndPassword(email, pwd).catch((e) => alert(e));
	};

	return (
		<div className="loginMain">
			<form className="authForm">
				<h1>Login</h1>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={pwd}
					onChange={(e) => setPwd(e.target.value)}
				/>
				<button className="btn-primary" onClick={login}>
					Login
				</button>
			</form>
		</div>
	);
}
function Signup() {
	const [email, setEmail] = useState("");
	const [pwd, setPwd] = useState("");
	const [cnfPwd, setCnfPwd] = useState("");
	const [isTutor, setIsTutor] = useState(false);
	const [subjects, setSubjects] = useState([]);
	const [selectedSubs, setSelectedSubs] = useState([]);

	useEffect(() => {
		db.collection("subjects")
			.get()
			.then((snap) => {
				setSubjects(snap.docs.map((doc) => doc.data().name));
			});
	}, []);

	const register = (e) => {
		e.preventDefault();
		if (pwd !== cnfPwd) {
			alert("Passwords don't match!");
			return;
		}
		auth.createUserWithEmailAndPassword(email, pwd).then((user) => {
			if (isTutor)
				db.collection("tutors")
					.doc(user.user.uid)
					.set({ uid: user.user.uid, email: email, subjects: selectedSubs });
			else
				db.collection("students")
					.doc(user.user.uid)
					.set({ uid: user.user.uid, email: email });
		});
	};

	return (
		<div className="registerMain">
			<form className="authForm">
				<h1>Sign Up</h1>
				<input
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
				/>
				<input
					type="password"
					onChange={(e) => setPwd(e.target.value)}
					placeholder="Password"
				/>
				<input
					type="password"
					onChange={(e) => setCnfPwd(e.target.value)}
					placeholder="Confirm Password"
				/>
				<span
					style={{
						display: "flex",
						justifyContent: "space-around",
						width: "100%",
					}}
				>
					<input
						type="checkbox"
						value={isTutor}
						onChange={(e) => setIsTutor(e.target.checked)}
						style={{ flex: 1 }}
					/>
					<p style={{ flex: 2 }}>Register as a Tutor</p>
				</span>
				{isTutor && (
					<div>
						{subjects.map((sub) => (
							<span
								style={{
									display: "flex",
									justifyContent: "space-evenly",
									width: "100%",
								}}
							>
								<input
									type="checkbox"
									value={sub}
									style={{ flex: 1 }}
									onChange={(e) => {
										const selected = e.target.checked;
										const value = e.target.value;
										if (!selected) {
											const p = selectedSubs;
											p.splice(p.indexOf(value), 1);
											setSelectedSubs(p);
										} else {
											setSelectedSubs((p) => [...p, value]);
										}
									}}
								/>
								<p style={{ flex: 2 }}>{sub}</p>
							</span>
						))}
					</div>
				)}
				<button className="btn-primary" type="submit" onClick={register}>
					Sign Up
				</button>
			</form>
		</div>
	);
}
