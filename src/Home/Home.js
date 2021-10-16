import React, { useContext, useEffect } from 'react';
import userContext from "../Context/userContext";
import Button from "@material-ui/core/Button";
import { useHistory } from 'react-router-dom';

const Home = () => {
    const history = useHistory();
    const { userData, logout } = useContext(userContext);

    useEffect(() => {
        if (!userData) {
            history.push('/');
        } else if (userData && !userData.userRole) {
            history.push('/');
        }
    }, [userData, history])

    return (
        <div>
            {userData && (<div>
                {userData.userRole === "admin" && <h3>You are logged in as admin</h3>}
                {userData.userRole === "tutor" && <h3>You are logged in as tutor</h3>}
                {userData.userRole === "student" && <h3>You are logged in as student</h3>}
            </div>)}
            <Button onClick={logout}>Logout</Button>
        </div>
    )
}

export default Home
