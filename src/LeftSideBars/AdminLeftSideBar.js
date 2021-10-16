import React, { useEffect, useContext } from "react";
import userContext from "../Context/userContext";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		textAlign: "center",
	},
	drawer: {
		[theme.breakpoints.up("sm")]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		backgroundColor: "white",
		color: "black",
		[theme.breakpoints.up("sm")]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
		cursor: "default",
		boxShadow: "none",
	},
	headingText: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		fontWeight: "bold",
		padding: 5,
		color :" #3549ab"
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up("sm")]: {
			display: "none",
		},
	},
	// necessary for content to be below app bar
	//   toolbar: theme.mixins.toolbar,
	toolbar: {
		textAlign: "center",
	},
	drawerPaper: {
		width: drawerWidth,
	},
	root1: {
		width: "100%",
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
		textAlign: "center",
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
	sideBarTitle : {
		color :" #3549ab",
	
	}
}));

function AdminLeftSideBar(props) {
	const { window } = props;
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [tutorOpen, setTutorOpen] = React.useState(false);
	const [studentOpen, setStudentOpen] = React.useState(false);
	const { userData, logout } = useContext(userContext);
	const { appBarHeading } = props;

	const handleTutorOptionClick = () => {
		setTutorOpen(!tutorOpen);
	};

	const handleStudentOptionClick = () => {
		setStudentOpen(!studentOpen);
	};

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	useEffect(() => {
		if (!userData) {
			history.push("/");
		} else if (userData && !userData.userRole) {
			history.push("/");
		} else if (
			userData &&
			userData.userRole &&
			userData.userRole !== "admin" &&
			userData.userRole !== "subadmin"
		) {
			history.push("/");
		}
	}, [userData, history]);

	const drawer = (
		<div>
			<div className={classes.toolbar}>
				<h3
					style={{ cursor: "pointer",fontFamily:"sans-serif",color:" #3549ab" }}
					onClick={() => history.push("/admin/home")}
				>
					Admin Controls
				</h3>
				<Divider />
			</div>
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				className={classes.root1}
			>
				<ListItem button onClick={() => history.push("/admin/home")}>
					<ListItemText primary="Dashboard" className={classes.sideBarTitle}/>
				</ListItem>
				<Divider />
				<ListItem button onClick={() => history.push("/admin/schedule")}>
					<ListItemText className={classes.sideBarTitle} primary="Session Schedule" />
				</ListItem>
				<Divider />
				<ListItem
					button
					onClick={() => {
						if (userData && userData.uid) {
							history.push(`/admin/user/${userData.uid}`);
						}
					}}
				>
					<ListItemText  className={classes.sideBarTitle} primary="Personal Details" />
				</ListItem>
				<Divider />
				<ListItem button  onClick={handleTutorOptionClick}>
					<ListItemText className={classes.sideBarTitle} primary="Tutor" />
					{tutorOpen ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={tutorOpen} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItem
							button
							className={classes.nested}
							onClick={() => history.push("/admin/tutor/Approved")}
						>
							<ListItemText className={classes.sideBarTitle} primary="Approved Tutors" />
						</ListItem>
						<ListItem
							button
							className={classes.nested}
							onClick={() => history.push("/admin/tutor/Unapproved")}
						>
							<ListItemText className={classes.sideBarTitle} primary="Registered-Unapproved Tutors" />
						</ListItem>
						<ListItem
							button
							className={classes.nested}
							onClick={() => history.push("/admin/tutor/Rejected")}
						>
							<ListItemText className={classes.sideBarTitle} primary="Rejected Tutors" />
						</ListItem>
						<ListItem
							button
							className={classes.nested}
							onClick={() => history.push("/admin/tutor/Deleted")}
						>
							<ListItemText className={classes.sideBarTitle} primary="Deleted Tutors" />
						</ListItem>
					</List>
				</Collapse>
				<Divider />
				<ListItem button onClick={handleStudentOptionClick}>
					<ListItemText className={classes.sideBarTitle} primary="Student" />
					{studentOpen ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={studentOpen} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItem
							button
							className={classes.nested}
							onClick={() => history.push("/admin/students/all")}
						>
							<ListItemText className={classes.sideBarTitle} primary="View All Students" />
						</ListItem>
					</List>
				</Collapse>
				<Divider />
				<ListItem button onClick={() => history.push("/admin/map")}>
					<ListItemText className={classes.sideBarTitle} primary="Maps" />
				</ListItem>
				<Divider />
				<ListItem button>
					<ListItemText className={classes.sideBarTitle} primary="Test results" />
				</ListItem>
				<Divider />
				{userData.userRole === "admin" && (
					<ListItem button onClick={() => history.push("/admin/create/admin")}>
						<ListItemText  className={classes.sideBarTitle} primary="Create Admin" />
					</ListItem>
				)}
				<ListItem button onClick={() => history.push("/admin/create/subadmin")}>
					<ListItemText className={classes.sideBarTitle} primary="Create Subadmin" />
				</ListItem>
				<Divider />
				<ListItem button>
					<ListItemText className={classes.sideBarTitle} primary="Session History" />
				</ListItem>
				<Divider />
				<ListItem button onClick={logout}>
					<ListItemText className={classes.sideBarTitle} primary="Logout" />
				</ListItem>
			</List>
		</div>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<div className={classes.root}>
			{/* <CssBaseline /> */}
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						className={classes.menuButton}
					>
						<MenuIcon />
					</IconButton>
					<Typography  variant="h5" noWrap className={classes.headingText}>
						{appBarHeading}
					</Typography>
				</Toolbar>
			</AppBar>
			<nav className={classes.drawer} aria-label="mailbox folders">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation="css">
					<Drawer
						container={container}
						variant="temporary"
						anchor={theme.direction === "rtl" ? "right" : "left"}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation="css">
					<Drawer
						classes={{
							paper: classes.drawerPaper,
						}}
						variant="permanent"
						open
					>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
		</div>
	);
}

export default AdminLeftSideBar;
