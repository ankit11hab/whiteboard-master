import React, { useState, useEffect } from 'react';
import './TutorPageInfo.css';
import { useHistory } from 'react-router-dom';
import { db } from "../Context/firebase";
import { Card, CircularProgress, Button } from '@material-ui/core'
import { useParams } from 'react-router-dom';
import AdminLeftSideBar from '../LeftSideBars/AdminLeftSideBar';

const TutorPageInfo = () => {
    const history = useHistory();
    const { tutorsDetail } = useParams();
    const [loading, setLoading] = useState(false);
    const [tutorsData, setTutorsData] = useState([]);

    useEffect(() => {
        setLoading(true);
        db.collection('tutors')
            .where('status', "==", tutorsDetail)
            .onSnapshot(snap => {
                setTutorsData(snap.docs.map(tut => ({ id: tut.id, value: tut.data() })));
                setLoading(false);
            })
    }, [tutorsDetail])

    const handleTutorAccept = (tutorId) => {
        console.log("hello")
        db.collection('tutors').doc(tutorId).update({
            status: "Approved"
        })
    }

    const handleTutorReject = (tutorId) => {
        db.collection('tutors').doc(tutorId).update({
            status: "Rejected"
        })
    }

    const handleTutorDelete = (tutorId) => {
        db.collection('tutors').doc(tutorId).update({
            status: "Deleted"
        })
    }

    return (
        <div className='adminTutorInfoPage'>
            <AdminLeftSideBar appBarHeading={`${tutorsDetail} Tutors`} />
            <main>
                {/* <h2 className='adminHomeHeader'>{tutorsDetail} Tutors</h2>
                <hr /> */}
                {loading ? <CircularProgress /> : (
                    <div>
                        {tutorsData.map(tutor => (
                            
                            <Card key={tutor.id} className='tutorDetails'>
                                <div className="tutorPersonalInfo">
                                    <h3 onClick={() => history.push(`/admin/user/${tutor.id}`)}>{tutor.value.email}</h3>
                                </div>
                                <div>
                                    {tutorsDetail === 'Unapproved' && (
                                        <div className='tutorActionOptions'>
                                            <Button variant='contained'
                                                onClick={() => handleTutorAccept(tutor.id)}
                                                className='tutorActionButton tutorActionAccept'>
                                                Approve
                                            </Button>
                                            <Button variant='contained'
                                                onClick={() => handleTutorReject(tutor.id)}
                                                className='tutorActionButton tutorActionReject'>
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                    {tutorsDetail === 'Approved' && (
                                        <div className='tutorActionOptions'>
                                        
                                            <Button variant='contained'
                                                color="secondary"
                                                className='tutorActionButton tutorActionDelete'
                                                onClick={() => handleTutorDelete(tutor.id)}>
                                                Delete</Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default TutorPageInfo
