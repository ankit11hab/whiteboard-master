import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './TutorPageInfo.css';
import { db } from "../Context/firebase";
import { Card, CircularProgress, Button } from '@material-ui/core'
import AdminLeftSideBar from '../LeftSideBars/AdminLeftSideBar';

const AllStudents = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [studentsData, setStudentsData] = useState([]);

    useEffect(() => {
        setLoading(true);
        db.collection('students')
            // .where('userRole', '==', 'student')
            .get().then(snap => {
                let arr = [];
                snap.docs.map(stu => arr.push({ id: stu.id, value: stu.data() }));
                setStudentsData(arr);
                setLoading(false);
            })
    }, [])

    return (
        <div className='adminTutorInfoPage'>
            <AdminLeftSideBar appBarHeading={`All Students`} />
            <main>
                {/* <h2 className='adminHomeHeader'>{tutorsDetail} Tutors</h2>
                <hr /> */}
                {loading ? <CircularProgress /> : (
                    <div>
                        {studentsData.map(student => (
                            <Card key={student.id} className='tutorDetails'>
                                <div className="tutorPersonalInfo">
                                    <h3>{student.value.phone || student.value.email}</h3>
                                </div>
                                <div className='tutorActionOptions'>
                                    <Button variant='contained'
                                        onClick={() => history.push(`/admin/user/${student.id}`)}
                                        color='primary'>View Details</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default AllStudents
