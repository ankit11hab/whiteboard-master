import React, { useState, useEffect, useContext } from 'react';
import './TutorPageUserDetail.css';
import { useHistory } from 'react-router-dom';
import userContext from "../Context/userContext";
import { db } from '../Context/firebase';
import defaultPic from '../assets/defaultImage.jpg';
import { useParams } from 'react-router-dom';
import { Avatar, IconButton, CircularProgress, Button } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import TutorLeftSideBar from '../LeftSideBars/TutorLeftSideBar';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditName from '../EditOptions/EditName';
import EditProfilePicture from '../EditOptions/EditProfilePicture';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
})

const TutorPageUserDetail = () => {
    const classes = useStyles();
    const history = useHistory();
    const { userId } = useParams();
    const { userData } = useContext(userContext);
    const [loading, setLoading] = useState(false);
    const [currentUserData, setCurrentUserData] = useState({});
    const [editNameOption, setEditNameOption] = useState(false);
    const [editProfileOption, setEditProfileOption] = useState(false);

    useEffect(() => {
        setLoading(true);
        db.collection('userData').doc(userId)
            .onSnapshot(snap => {
                setCurrentUserData(snap.data());
                setLoading(false);
            })
    }, [userId])

    const handleNameClose = () => setEditNameOption(false);
    const handleProfileClose = () => setEditProfileOption(false);

    return (
        <div>
            <TutorLeftSideBar appBarHeading={`Personal Details`} />
            <main>
                {loading ? <CircularProgress /> : currentUserData ? (
                    <div>
                        <div className='userInfoHeader'>
                            <div className='userAvatar'>
                                <Avatar className='userInfoAvatar'
                                    onContextMenu={e => e.preventDefault()}
                                    src={currentUserData.profileImageURL || defaultPic}
                                    alt="User Profile Picture" />
                            </div>
                            <div className='userInfo'>
                                <h2>{currentUserData.name || currentUserData.email || currentUserData.phone}</h2>
                                <h2>Role: {currentUserData.userRole}</h2>
                            </div>
                        </div>
                        <hr />
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="right"></StyledTableCell>
                                        <StyledTableCell align="left">User Details</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <StyledTableRow>
                                        <StyledTableCell component="th" scope="row" align="center">
                                            Name :{userData && userData.uid === userId && (
                                                <IconButton onClick={() => setEditNameOption(true)}>
                                                    <BorderColorIcon />
                                                </IconButton>
                                            )}
                                        </StyledTableCell>
                                        {editNameOption && (
                                            <EditName currentName={currentUserData.name} handleNameClose={handleNameClose} />
                                        )}
                                        <StyledTableCell align="center">{currentUserData.name || "Not Provided"}</StyledTableCell>
                                    </StyledTableRow>
                                    {currentUserData && (currentUserData.userRole === 'admin' || currentUserData.userRole === 'subadmin' || currentUserData.userRole === 'tutor') && (
                                        <StyledTableRow>
                                            <StyledTableCell component="th" scope="row" align="center">
                                                Email :
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{currentUserData.email || "Not Provided"}</StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                    {currentUserData && currentUserData.userRole === 'student' && (
                                        <StyledTableRow>
                                            <StyledTableCell component="th" scope="row" align="center">
                                                Phone Number :
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{currentUserData.phone || "Not Provided"}</StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                    {/* {(userData && userData.uid === userId) ? (
                                        <StyledTableRow>
                                            <StyledTableCell component="th" scope="row" align="center">
                                                Subjects : <IconButton onClick={() => setEditNameOption(true)}>
                                                    <BorderColorIcon />
                                                </IconButton>
                                            </StyledTableCell>
                                            {editNameOption && (
                                                <EditName currentName={currentUserData.name} handleNameClose={handleNameClose} />
                                            )}
                                            <StyledTableCell align="center">{currentUserData.name || "Not Provided"}</StyledTableCell>
                                        </StyledTableRow>
                                    ) : ( */}
                                    <StyledTableRow>
                                        <StyledTableCell component="th" scope="row" align="center">
                                            User role :
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{currentUserData.userRole || "Not Provided"}</StyledTableCell>
                                    </StyledTableRow>
                                    {/* )} */}
                                    {userData && userData.uid === userId && (
                                        <StyledTableRow>
                                            <StyledTableCell component="th" scope="row" align="center">
                                                Profile Photo :
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <IconButton onClick={() => setEditProfileOption(true)}>
                                                    <PhotoCamera />
                                                </IconButton>
                                            </StyledTableCell>
                                            {editProfileOption && (
                                                <EditProfilePicture handleProfileClose={handleProfileClose} />
                                            )}
                                        </StyledTableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ) : (
                    <div className='userDetailsPage'>
                        <h2>User Not found</h2>
                        <Button style={{ marginTop: "20px" }} onClick={() => history.goBack()}>Go Back</Button>
                    </div>
                )}
            </main>
        </div >
    )
}

export default TutorPageUserDetail
