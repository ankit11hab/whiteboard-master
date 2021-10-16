import React, { useContext } from 'react';
import './Home.css';
import userContext from "../Context/userContext";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import StudentLeftSideBar from '../LeftSideBars/StudentLeftSideBar';

const StudentHome = () => {
    const history = useHistory();
    const { userData } = useContext(userContext);

    return (
        <div>
            <StudentLeftSideBar appBarHeading={`Student Control Panel`} />
            <main>
                {/* <h2 className='adminHomeHeader'>Admin Control Panel</h2>
                <hr /> */}
                <div className='adminHomeMain'>
                    <Card className='adminHomeOptions'>
                        <span className='adminHomeOptionInfo'>Personal Details</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminHomeOptionButton'
                            onClick={() => {
                                if (userData && userData.uid) {
                                    history.push(`/student/user/${userData.uid}`)
                                }
                            }}>
                            View
                        </Button>
                    </Card>
                    <Card className='adminHomeOptions'>
                        <span className='adminHomeOptionInfo'>Join Room</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminHomeOptionButton'
                            onClick={() => history.push('/room')}>
                            View
                        </Button>
                    </Card>
                    <Card className='adminHomeOptions'>
                        <span className='adminHomeOptionInfo'>Session History</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminHomeOptionButton'>
                            View
                        </Button>
                    </Card>
                    <Card className='adminHomeOptions'>
                        <span className='adminHomeOptionInfo'>Inter Session</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminHomeOptionButton'>
                            View
                        </Button>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default StudentHome;
