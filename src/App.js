import React, { useState, useEffect } from "react";
import userContext from "./Context/userContext";
import { Switch, Route } from "react-router-dom";
import { auth, db } from "./Context/firebase";
import { useHistory } from "react-router-dom";
/*Authentication files*/
import Login from "./Auth/Login";
import Register from "./Auth/Register";
/*Admin pages*/
import AdminHome from "./Home/AdminHome";
import MyDetails from "./Admin/MyDetails";
import TutorOptions from "./Admin/TutorOptions";
import TutorPageInfo from "./Admin/TutorPageInfo";
import AllStudents from "./Admin/AllStudents";
import CreateAdmin from "./Admin/CreateAdmin";
import Map from "./Admin/Map";
/*Tutor Pages */
import TutorHome from "./Home/TutorHome";
import TutorPageUserDetail from "./TutorControls/TutorPageUserDetail";
/*Student files */
import StudentHome from "./Home/StudentHome";
import StudentUserDetails from "./Student/StudentUserDetails";
/*Room files */
import Room from "./Rooms/Room";
// import Home from './Home/Home';
/*Old work*/
import SApp from "./SApp";
import SessionScheduling from "./Admin/SessionScheduling";
import EditName from "./EditOptions/EditName";
import firebase from "firebase";
// import "./Canvas/canvas.css";
// import Auth from "./Auth/Auth";
// import Room from "./Rooms/Room";
// import Admin from "./Admin/Admin";

function App() {
	const history = useHistory();
	const [user, setUser] = useState(null);
	const [tutorName, setTutorName] = useState("");
	const [studentName, setStudentName] = useState("");
	const [userData, setUserData] = useState({});
	const [isAdmin, setIsAdmin] = useState(false);
	const [isTutor, setIsTutor] = useState(false);
	const [globalRoomID, setGlobalRoomID] = useState(null);
	const [noName, setNoName] = useState(false); // to check if user has not provided their name

	auth.onAuthStateChanged((obj) => {
		setUser(obj);
	});

	useEffect(() => {
		if (!user) return;
		if (user) {
			db.collection("userData")
				.doc(user.uid)
				.get()
				.then(async (snap) => {
					if (
						snap.data().userRole === "admin" ||
						snap.data().userRole === "subadmin"
					) {
						setIsAdmin(true);
						history.push("/admin/home");
					}
					let ID = null;
					const snap2 = await db.collection("students").doc(user.uid).get();
					const snap3 = await db.collection("tutors").doc(user.uid).get();
					if (snap.exists && (snap2.exists || snap3.exists)) {
						setUserData(snap.data());
						setNoName(!snap.data().name);
						let role = snap.data().userRole;
						if (role === "admin" || role === "subadmin") {
							setIsAdmin(true);
							history.push("/admin/home");
						} else if (role === "tutor") {
							setIsTutor(true);
							history.push("/tutor/home");
						} else if (role === "student") {
							history.push("/home");
						}
					} else {
						let userRole =
							user.email === null || user.email === "" ? "student" : "tutor";
						let name =
							user.email === null || user.email === ""
								? studentName
								: tutorName;
						db.collection(userRole === "student" ? "students" : "tutors")
							.doc("metadata")
							.get()
							.then((doc) => {
								if (userRole === "student") {
									ID = `mmmstudent${doc.data().idCount}`;
									doc.ref.update({
										idCount: firebase.firestore.FieldValue.increment(1),
									});
								}
								if (userRole === "tutor") {
									ID = `mmmtutor${doc.data().idCount}`;
									doc.ref.update({
										idCount: firebase.firestore.FieldValue.increment(1),
									});
								}
								db.collection("userData")
									.doc(user.uid)
									.set({
										name,
										profileImageURL: "",
										email: user.email,
										phone: user.phoneNumber,
										uid: user.uid,
										userRole,
										ID,
									})
									.catch((error) => alert(error.message));
								setUserData({
									email: user.email,
									phone: user.phoneNumber,
									uid: user.uid,
									userRole,
								});
								if (userRole === "tutor") {
									setIsTutor(true);
									db.collection("tutors").doc(user.uid).update({
										name,
										uid: user.uid,
										email: user.email,
										status: "Unapproved",
										ID,
									});
									history.push("/tutor/home");
								} else if (userRole === "student") {
									db.collection("students").doc(user.uid).set({
										name,
										uid: user.uid,
										email: user.email,
										phone: user.phoneNumber,
										ID,
									});
									history.push("/home");
								}
							});
						console.log("User Not found");
					}
				});
			if (!userData.name && !isTutor && !isAdmin && user) {
				return <EditName currentName={userData.name} />;
			}
		}
	}, [user, history]);

	// useEffect(() => {
	// 	if (userData && userData.userRole) {
	// 		let role = userData.userRole;
	// 		if (role === 'admin') {
	// 			history.push('/admin/home');
	// 		} else if (role === 'tutor') {
	// 			history.push('/tutor/home');
	// 		} else if (role === 'student') {
	// 			history.push('/home');
	// 		}
	// 	}
	// }, [userData, history])
	// useEffect(() => {
	// 	if (!user) return;
	// 	db.collection("admins")
	// 		.doc(user.email)
	// 		.get()
	// 		.then((doc) => {
	// 			if (doc.exists) setIsAdmin(true);
	// 		});
	// 	db.collection("tutors")
	// 		.doc(user.uid)
	// 		.get()
	// 		.then((doc) => {
	// 			if (doc.exists) setIsTutor(true);
	// 		});
	// }, [user]);

	// useEffect(() => {
	// 	if (!user || !isTutor) return;
	// 	const end = db
	// 		.collection("tutors")
	// 		.doc(user.uid)
	// 		.collection("requestToJoin")
	// 		.onSnapshot((snap) => {
	// 			snap.docs.forEach((doc) => {
	// 				const accept = window.confirm(
	// 					doc.data().email + " has requested to join"
	// 				);
	// 				if (accept) {
	// 					db.collection("students")
	// 						.doc(doc.data().uid)
	// 						.update({ currentRoomID: globalRoomID });
	// 					db.collection("tutors")
	// 						.doc(user.uid)
	// 						.collection("currentStudents")
	// 						.doc(doc.data().uid)
	// 						.set(doc.data());
	// 				}
	// 				doc.ref.delete();
	// 			});
	// 		});
	// 	return end;
	// }, [isTutor, globalRoomID, user]);

	const logout = () => {
		// if (!isTutor || !isAdmin) {
		// 	db.collection("students").doc(user.uid).update({ currentRoomID: null });
		// }
		auth.signOut().then(() => {
			setUserData({});
			window.location.reload();
		});
	};

	return (
		<userContext.Provider
			value={{
				user,
				userData,
				setUserData,
				setUser,
				tutorName,
				setTutorName,
				studentName,
				setStudentName,
				isTutor,
				setIsTutor,
				globalRoomID,
				setGlobalRoomID,
				logout,
				isAdmin,
				setIsAdmin,
			}}
		>
			{/* {isAdmin && user ? (
				<Admin />
			) : (
				<div>
					{user && <Room />}
					{!user && <Auth setIsAdmin={setIsAdmin} />}
				</div>
			)} */}
			{noName ? (
				<EditName currentName={userData.name} />
			) : (
				<Switch>
					<Route exact path="/shreehari" component={SApp} />
					<Route exact path="/" component={Login} />
					<Route exact path="/register" component={Register} />
					{/*Admin Routes */}
					<Route exact path="/admin/map" component={Map} />
					<Route exact path="/admin/home" component={AdminHome} />
					<Route exact path="/admin/schedule" component={SessionScheduling} />
					<Route exact path="/admin/user/:userId" component={MyDetails} />
					<Route exact path="/admin/tutoroptions" component={TutorOptions} />
					<Route exact path="/admin/create/admin" component={CreateAdmin} />
					<Route exact path="/admin/create/subadmin" component={CreateAdmin} />
					<Route
						exact
						path="/admin/tutor/:tutorsDetail"
						component={TutorPageInfo}
					/>
					<Route exact path="/admin/students/all" component={AllStudents} />
					{/*Tutor Routes */}
					<Route exact path="/tutor/home" component={TutorHome} />
					<Route
						exact
						path="/tutor/user/:userId"
						component={TutorPageUserDetail}
					/>
					{/*Student Routes */}
					<Route exact path="/home" component={StudentHome} />
					<Route
						exact
						path="/student/user/:userId"
						component={StudentUserDetails}
					/>
					{/*Common for both Student and Tutor */}
					<Route exact path="/room" component={Room} />
				</Switch>
			)}
		</userContext.Provider>
	);
}

export default App;
