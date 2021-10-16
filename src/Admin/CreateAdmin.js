import React, { useEffect, useState } from 'react';
import './CreateAdmin.css';
import { useRouteMatch } from 'react-router-dom';
import { db } from '../Context/firebase';
import { TextField, Button, CircularProgress, Card } from '@material-ui/core';
import AdminLeftSideBar from '../LeftSideBars/AdminLeftSideBar';

const CreateAdmin = () => {
    const match = useRouteMatch();
    const [searchEmailId, setSearchEmailId] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPageName, setCurrentPageName] = useState("Create Admin");

    useEffect(() => {
        setLoading(false);
        setSearchResults([]);
        setSearchEmailId("");
        if (match.url === '/admin/create/subadmin') {
            setCurrentPageName("Create Subadmin");
        } else {
            setCurrentPageName("Create Admin")
        }
    }, [match.url])

    const searchEmail = () => {
        db.collection('userData')
            .where('email', '==', (searchEmailId).toLowerCase())
            .get().then(snap => {
                let arr = []
                snap.docs.map(user => arr.push({ id: user.id, value: user.data() }))
                setSearchResults(arr);
                setLoading(false);
            })
    }

    const handleEmailSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        searchEmail();
    }

    const assignAdminRoles = (userId) => {
        db.collection('userData').doc(userId).update({
            userRole: "admin"
        }).then(() => {
            setLoading(true);
            searchEmail();
        }).catch(error => alert(error.message))
    }

    const assignSubadminRoles = (userId) => {
        db.collection('userData').doc(userId).update({
            userRole: "subadmin"
        }).then(() => {
            setLoading(true);
            searchEmail();
        }).catch(error => alert(error.message))
    }

    const assignTutorRoles = (userId) => {
        db.collection('userData').doc(userId).update({
            userRole: "tutor"
        }).then(() => {
            setLoading(true);
            searchEmail();
        }).catch(error => alert(error.message))
    }

    return (
        <div>
            <AdminLeftSideBar appBarHeading={currentPageName} />
            <main className='newAdminPage'>
                <h2>Search the Email Id in the below text box to give/remove {currentPageName.substr(7)} rights</h2>
                <form className='adminSearchBox' onSubmit={handleEmailSearch}>
                    <div>
                        <TextField
                            style={{ width: "300px" }}
                            label="Search email"
                            variant="outlined"
                            placeholder='xyz@email.com'
                            value={searchEmailId}
                            onChange={e => setSearchEmailId(e.target.value)}
                            type="email" required />
                    </div>
                    <div className='searchButton'>
                        <Button style={{ color: "#0d0b6d" }} type='submit' variant='contained'>Search</Button>
                    </div>
                </form>
                <hr />
                <h2>Search Results</h2>
                {loading ? <CircularProgress /> : (
                    <div className='searchResults'>
                        {searchResults.length === 0 ? <h3 style={{fontFamily:"sans-serif"}}>No User found !</h3> : (
                            searchResults.map(({ id, value }) => (
                                <Card key={id} className='userAllDetails'>
                                    <div className='userInfo'>
                                        <h3>{value.name}</h3>
                                        <h5>{value.email}</h5>
                                    </div>
                                    <div className="userAllDetailsLeft">
                                        <h4>Current User Role : {value.userRole}</h4>
                                        {currentPageName === 'Create Admin' && (value.userRole !== 'admin' ? (
                                            <Button variant='contained'
                                                onClick={() => assignAdminRoles(id)}
                                                style={{ color: "green",fontWeight:700 }}>
                                                Make Admin
                                            </Button>
                                        ) : (
                                            <Button variant='contained'
                                                onClick={() => assignTutorRoles(id)}
                                                style={{ color: "green",fontWeight:700 }}>
                                                Make Tutor
                                            </Button>
                                        ))}
                                        {value.userRole !== 'admin' && (
                                            <div>
                                                {currentPageName === 'Create Subadmin' && (value.userRole !== 'subadmin' ? (
                                                    <Button variant='contained'
                                                        onClick={() => assignSubadminRoles(id)}
                                                        style={{ color: "#0d0b6d" }}>
                                                        Make Subadmin
                                                    </Button>
                                                ) : (
                                                    <Button variant='contained'
                                                        onClick={() => assignTutorRoles(id)}
                                                        style={{ color: "#0d0b6d" }}>
                                                        Make Tutor
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default CreateAdmin
