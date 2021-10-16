import React from 'react';
import '../Home/Home.css';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import AdminLeftSideBar from '../LeftSideBars/AdminLeftSideBar';

const TutorOptions = () => {
    const history = useHistory();
    return (
        <div>
            <AdminLeftSideBar appBarHeading={`Tutor Options`} />
            <main>
                {/* <h2 className='adminHomeHeader'>Tutor Options</h2>
                <hr /> */}
                <div className='adminTutorOptionMain'>
                    <Card className='adminTutorOptions'>
                        <span className='adminHomeOptionInfo'>Approved Tutors</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminTutorOptionButton'
                            onClick={() => history.push('/admin/tutor/Approved')}>
                            View
                        </Button>
                    </Card>
                    <Card className='adminTutorOptions'>
                        <span className='adminHomeOptionInfo'>Unapproved Tutors</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminTutorOptionButtonUnapp'
                            onClick={() => history.push('/admin/tutor/Unapproved')}>
                            View
                        </Button>
                    </Card>
                    <Card className='adminTutorOptions'>
                        <span className='adminHomeOptionInfo'>Rejected Tutors</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminTutorOptionButton'
                            onClick={() => history.push('/admin/tutor/Rejected')}>
                            View
                        </Button>
                    </Card>
                    <Card className='adminTutorOptions'>
                        <span className='adminHomeOptionInfo'>Deleted Tutors</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminTutorOptionButton'
                            onClick={() => history.push('/admin/tutor/Deleted')}>
                            View
                        </Button>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default TutorOptions
