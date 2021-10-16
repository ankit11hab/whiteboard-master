import React, { useEffect, useContext } from "react";
import "./Canvas/canvas.css";
import { db } from "./Context/firebase";
import Auth from "./Auth/Auth";
import userContext from "./Context/userContext";
import Room from "./Rooms/Room";
import Admin from "./Admin/Admin";

const SApp = () => {
    const { user, isTutor, setIsTutor, globalRoomID, isAdmin, setIsAdmin } = useContext(userContext);

    useEffect(() => {
        if (!user) return;
        db.collection("admins")
            .doc(user.email)
            .get()
            .then((doc) => {
                if (doc.exists) setIsAdmin(true);
            });
        db.collection("tutors")
            .doc(user.uid)
            .get()
            .then((doc) => {
                if (doc.exists) setIsTutor(true);
            });

    }, [user, setIsAdmin, setIsTutor]);

    useEffect(() => {
        if (!user || !isTutor) return;
        const end = db
            .collection("tutors")
            .doc(user.uid)
            .collection("requestToJoin")
            .onSnapshot((snap) => {
                snap.docs.forEach((doc) => {
                    const accept = window.confirm(
                        doc.data().email + " has requested to join"
                    );
                    if (accept) {
                        db.collection("students")
                            .doc(doc.data().uid)
                            .update({ currentRoomID: globalRoomID });
                        db.collection("tutors")
                            .doc(user.uid)
                            .collection("currentStudents")
                            .doc(doc.data().uid)
                            .set(doc.data());
                    }
                    doc.ref.delete();
                });
            });
        return end;
    }, [isTutor, globalRoomID, user]);



    return (
        <div className='SApp'>
            {isAdmin && user ? (
                <Admin />
            ) : (
                <div>
                    {user && <Room />}
                    {!user && <Auth setIsAdmin={setIsAdmin} />}
                </div>
            )}
        </div>
    )
}

export default SApp
