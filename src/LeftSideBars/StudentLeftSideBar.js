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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from "@material-ui/core/ListItemText";
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
		textDecoration: "underline",
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
}));

function StudentLeftSideBar(props) {
	const { window } = props;
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const { userData, logout } = useContext(userContext);
	const { appBarHeading } = props;

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
			userData.userRole !== "student"
		) {
			history.push("/");
		}
	}, [userData, history]);

	const drawer = (
		<div>
			<div className={classes.toolbar}>
				<h3 style={{ cursor: "pointer" }} onClick={() => history.push("/home")}>
					Student Controls
				</h3>
				<Divider />
			</div>
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				className={classes.root1}
			>
				<ListItem button onClick={() => history.push("/home")}>
					<ListItemText primary="Dashboard" />
				</ListItem>
				<Divider />
				<ListItem
					button
					onClick={() => {
						if (userData && userData.uid) {
							history.push(`/student/user/${userData.uid}`);
						}
					}}
				>
					<ListItemText primary="Personal Details" />
				</ListItem>
				<Divider />
				<ListItem button onClick={() => history.push("/room")}>
					<ListItemText primary="Join Room" />
				</ListItem>
				<Divider />
				<ListItem button>
					<ListItemText primary="Session History" />
				</ListItem>
				<ListItem button>
					<ListItemText primary="Inter Session" />
				</ListItem>
				<Divider />
				<ListItem button onClick={logout}>
					<ListItemText primary="Logout" />
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
					<Typography variant="h5" noWrap className={classes.headingText}>
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

export default StudentLeftSideBar;
