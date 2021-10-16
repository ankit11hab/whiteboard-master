import React, { useState, useEffect, useContext } from 'react';
import './MyDetails.css';
import { useHistory } from 'react-router-dom';
import userContext from "../Context/userContext";
import { db } from '../Context/firebase';
import defaultPic from '../assets/defaultImage.jpg';
import { useParams } from 'react-router-dom';
import { Avatar, IconButton, CircularProgress, Button } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import AdminLeftSideBar from '../LeftSideBars/AdminLeftSideBar';
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
    Tablename : {
        color: "tomato",
        fontSize : 18
    },
    Tabletitle : {
        fontSize : 15,
        fontWeight : 'bold',
        color : 'black'
    }
})

const MyDetails = () => {
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
            <AdminLeftSideBar appBarHeading={`Personal Details`} />
            <main>
                {loading ? 
                    <div className="loadingIcon">
                        <CircularProgress /> 
                    </div>
                    : currentUserData ? (
                    <div>
                        <div className='userInfoHeader'>
                            <div className='userAvatar'>
                                <Avatar className='userInfoAvatar'
                                    onContextMenu={e => e.preventDefault()}
                                    src={currentUserData.profileImageURL || defaultPic}
                                    alt="User Profile Picture" />
                            </div>
                            <div className='userInfo'>
                                <h3>{currentUserData.name || currentUserData.email || currentUserData.phone}</h3>
                                <h4>Role - {currentUserData.userRole}</h4>
                            </div>
                        </div>
                        <hr />
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="right"></StyledTableCell>
                                        <StyledTableCell style={{fontSize : 18,fontWeight : 'bold',color:"white"}} align="left">User Details</StyledTableCell>
                                    </TableRow> 
                                </TableHead>
                                <TableBody>
                                    <StyledTableRow>
                                        <StyledTableCell className={classes.Tabletitle} component="th" scope="row" align="center">
                                            Name {userData && userData.uid === userId && (
                                                <IconButton onClick={() => setEditNameOption(true)}>
                                                    <BorderColorIcon />
                                                </IconButton>
                                            )}
                                        </StyledTableCell>
                                        {editNameOption && (
                                            <EditName className={classes.Tabletitle} currentName={currentUserData.name} handleNameClose={handleNameClose} />
                                        )}
                                        <StyledTableCell className={classes.Tablename} align="center">{currentUserData.name || "Not Provided"}</StyledTableCell>
                                    </StyledTableRow>
                                    {currentUserData && (currentUserData.userRole === 'admin' || currentUserData.userRole === 'subadmin' || currentUserData.userRole === 'tutor') && (
                                        <StyledTableRow>
                                            <StyledTableCell className={classes.Tabletitle} component="th" scope="row" align="center">
                                                Email 
                                            </StyledTableCell>
                                            <StyledTableCell align="center" className={classes.Tablename}>{currentUserData.email || "Not Provided"}</StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                    {currentUserData && currentUserData.userRole === 'student' && (
                                        <StyledTableRow>
                                            <StyledTableCell className={classes.Tabletitle} component="th" scope="row" align="center">
                                                Phone Number 
                                            </StyledTableCell>
                                            <StyledTableCell className={classes.Tablename} align="center">{currentUserData.phone || "Not Provided"}</StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                    <StyledTableRow>
                                        <StyledTableCell className={classes.Tabletitle} component="th" scope="row" align="center">
                                            User role 
                                        </StyledTableCell>
                                        <StyledTableCell className={classes.Tablename} align="center">{currentUserData.userRole || "Not Provided"}</StyledTableCell>
                                    </StyledTableRow>
                                    {userData && userData.uid === userId && (
                                        <StyledTableRow>
                                            <StyledTableCell className={classes.Tabletitle} component="th" scope="row" align="center">
                                                Profile Photo 
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <IconButton onClick={() => setEditProfileOption(true)}>
                                                    <PhotoCamera className={classes.Tablename}/>
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

export default MyDetails
