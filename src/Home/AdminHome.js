import React, { useContext } from 'react';
import './Home.css';
import userContext from "../Context/userContext";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import AdminLeftSideBar from '../LeftSideBars/AdminLeftSideBar';

const AdminHome = () => {
    const history = useHistory();
    const { userData } = useContext(userContext);

    return (
        <div>
            <AdminLeftSideBar appBarHeading={`Admin Control Panel`} />
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
                                    history.push(`/admin/user/${userData.uid}`)
                                }
                            }}>
                            View
                        </Button>
                    </Card>
                    <Card className='adminHomeOptions'>
                        <span className='adminHomeOptionInfo'>Tutor Options</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminHomeOptionButton'
                            onClick={() => history.push('/admin/tutoroptions')}>
                            View
                        </Button>
                    </Card>
                    <Card className='adminHomeOptions'>
                        <span className='adminHomeOptionInfo'>Student Options</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminHomeOptionButton'
                            onClick={() => history.push('/admin/students/all')}>
                            View
                        </Button>
                    </Card>
                    <Card className='adminHomeOptions'>
                        <span className='adminHomeOptionInfo'>Test Results</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminHomeOptionButton'
                            onClick={() => history.push('/admin/home')}>
                            View
                        </Button>
                    </Card>
                    {userData.userRole === 'admin' && (
                        <Card className='adminHomeOptions'>
                            <span className='adminHomeOptionInfo'>Create Admin</span>
                            <br />
                            <Button
                                variant='contained'
                                color='primary'
                                className='adminHomeOptionButton'
                                onClick={() => history.push('/admin/create/admin')}>
                                View
                            </Button>
                        </Card>
                    )}
                    <Card className='adminHomeOptions'>
                        <span className='adminHomeOptionInfo'>Create Subadmin</span>
                        <br />
                        <Button
                            variant='contained'
                            color='primary'
                            className='adminHomeOptionButton'
                            onClick={() => history.push('/admin/create/subadmin')}>
                            View
                        </Button>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default AdminHome
