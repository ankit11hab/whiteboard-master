import React, { useEffect, useState } from "react";
import "./Auth.css";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import LockIcon from "@material-ui/icons/Lock";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { auth } from "../Context/firebase";
import firebase from "firebase";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const window = {
	recaptchaVerifier: undefined,
};

// function validatePhonenumber(phone) {
//     var re = /^\+[1-9]{2}[0-9]{10}$/
//     return re.test(phone);
// }

const useStyles = makeStyles((theme) => ({
	search: {
		position: "relative",
		borderRadius: "30px",
		display: "flex",
		backgroundColor: "inherit",
		margin: "5%",
		color: "white",
		width: "280px",
		marginLeft: "50%",
		transform: "translateX(-50%)",
		fontFamily: "inherit",
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		color: "rgb(13,11,109)",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		color: "rgb(13,11,109)",
		fontFamily: "Benne",
	},
	inputInput2: {
		// padding: theme.spacing(1, 1, 1, 0),
		// paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		borderBottom: "1px solid blue",
		fontFamily: "inherit",
		backgroundColor: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		borderBottom: "1px solid blue",
		fontFamily: "inherit",
		backgroundColor: "inherit",
	},
	inputRoot1: {
		color: "#0d0b6d",
		borderBottom: "1px solid #0d0b6d",
	},
	inputInput1: {
		padding: theme.spacing(1, 1, 1, 0),
		transition: theme.transitions.create("width"),
		width: "100%",
	},
}));

const Login = () => {
	const classes = useStyles();
	const history = useHistory();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [mobile, setMobile] = useState("");
	const [sendOTP, setSendOTP] = useState(false);
	const [resendOTP, setResendOTP] = useState(false);
	const [authCode, setAuthCode] = useState("");
	const [userOTP, setUserOTP] = useState("");
	const [counter, setCounter] = useState(60);
	const [otpFunc, setOtpFunc] = useState(true);
	const [message, setMessage] = useState("");
	const [timer, setTimer] = useState(null);
	const [resetMessage, setResetMessage] = useState("");
	const [countryCode, setCountryCode] = useState("+91");

	const handleCountryCode = (event) => {
		setCountryCode(event.target.value);
	};

	const submitEmailHandler = (e) => {
		e.preventDefault();
		if (!email || !password) {
			alert("Fill all the credentials !");
		} else {
			auth
				.signInWithEmailAndPassword(email, password)
				.catch((e) => alert(e.message)); // on state changed (in App.js will listen to this)
		}
	};

	const handleForgot = () => {
		if (!email) {
			alert("Enter email first!");
		} else {
			auth
				.sendPasswordResetEmail(email)
				.then(() => {
					setResetMessage("Password reset link sent successfully!");
				})
				.catch((e) => alert(e.message)); // on state changed (in App.js will listen to this)
		}
	};

	const handlePhoneLogin = () => {
		if (mobile && authCode && userOTP) {
			authCode
				.confirm(userOTP)
				.then((result) => {
					console.log(result)
				})
				// .catch((error) => {
				// 	alert(error.message);
				// });
		} else if (!mobile) {
			alert("Enter valid mobile number");
		} else if (!authCode) {
			alert("OTP not sent");
		} else if (!userOTP) {
			alert("Enter OTP");
		}
	};

	const handleOTPSend = () => {
		if (!mobile) {
			alert("Enter mobile number first");
		} else if (mobile && mobile.length !== 10) {
			alert("Phone number not correctly formated");
		} else if (
			mobile &&
			(mobile === "+911234567890" ||
				mobile === "+910123456789" ||
				mobile === "+919999999999" ||
				mobile === "+911111111111")
		) {
			alert("Check your number again");
		} else {
			let recaptcha = window.recaptchaVerifier;
			setSendOTP(true);
			if (!resendOTP) {
				setResendOTP(true);
			}
			setCounter(60);
			let mobileNum = countryCode + mobile;
			auth
				.signInWithPhoneNumber(mobileNum, recaptcha)
				.then((confirmationCode) => {
					setAuthCode(confirmationCode);
					setMessage("OTP sent successfully !");
				})
				.catch((error) => {
					alert(error.message);
					console.log(error.message);
				});
		}
	};

	const handleOTP = () => {
		if (!mobile) {
			alert("Enter mobile Number first! ");
		} else if (mobile.length !== 10) {
			alert("Phone number not correctly formated");
		} else if (
			mobile &&
			(mobile === "+911234567890" ||
				mobile === "+910123456789" ||
				mobile === "+919999999999" ||
				mobile === "+911111111111")
		) {
			alert("Check your number again");
		} else {
			window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
				"recaptcha-container",
				{
					size: "invisible",
				}
			);
			setOtpFunc(false);
			handleOTPSend();
		}
	};

	useEffect(() => {
		if (sendOTP) {
			counter > 0
				? setTimer(setInterval(() => setCounter(counter - 1), 1000))
				: setSendOTP(false);
		}
		if (!sendOTP) {
			setTimer(null);
		}
		return () => clearInterval(timer);
		//react-hooks/exhaustive-deps
	}, [sendOTP, counter]);

	return (
		<div>
			<div className="authHeader">
				<h1>Welcome to MyMegaminds Whiteboard</h1>
			</div>
			<hr />
			<div className="authPageMain">
				<div className="tutorSide loginForm">
					<h2>Login as Tutor</h2>
					{resetMessage && <h3>{resetMessage}</h3>}
					<form onSubmit={submitEmailHandler}>
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<EmailIcon />
							</div>
							<InputBase
								placeholder="Enter Email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput,
								}}
								inputProps={{ "aria-label": "search" }}
							/>
						</div>
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<LockIcon />
							</div>
							<InputBase
								placeholder="Enter Password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput,
								}}
								inputProps={{ "aria-label": "search" }}
							/>
						</div>
						<div className="loginOptions">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								className="submitLoginButton loginButton"
							>
								Login
							</Button>
							<br />
							<Button className="forgot" onClick={handleForgot}>
								Forgot Password?
							</Button>
						</div>
					</form>
				</div>
				<div className="studentSide loginForm">
					<h2>Login as Student</h2>
					{message && <h3>{message}</h3>}
					<div>
						<div className="countryMenuRegister">
							<div>
								<PhoneIcon />
							</div>
							<div>
								{/* <InputLabel id="demo-simple-select-label">Country</InputLabel> */}
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={countryCode}
									onChange={handleCountryCode}
								>
									<MenuItem value={"+91"}>India</MenuItem>
									<MenuItem value={"+971"}>UAE</MenuItem>
									<MenuItem value={"+1"}>USA</MenuItem>
								</Select>
							</div>
							<InputBase
								placeholder="Enter Phone"
								type="number"
								value={mobile}
								onChange={(e) => setMobile(e.target.value)}
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput2,
								}}
								inputProps={{ "aria-label": "search" }}
							/>
						</div>
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<LockIcon />
							</div>
							<InputBase
								placeholder="Enter OTP"
								type="number"
								value={userOTP}
								onChange={(e) => setUserOTP(e.target.value)}
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput,
								}}
								inputProps={{ "aria-label": "search" }}
							/>
						</div>
						<div id="recaptcha-container" />
						<div className="loginOptions">
							<Button
								variant="contained"
								color="primary"
								onClick={handlePhoneLogin}
								className="submitLoginButton loginButton"
							>
								Login
							</Button>
						</div>
						{!resendOTP ? (
							<div className="loginOptions">
								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										otpFunc ? handleOTP() : handleOTPSend();
									}}
									className="submitLoginButton loginButton"
								>
									Send OTP
								</Button>
							</div>
						) : sendOTP ? (
							<Button className="forgot">Resend OTP in {counter}</Button>
						) : (
							<div className="loginOptions">
								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										otpFunc ? handleOTP() : handleOTPSend();
									}}
									className="submitLoginButton loginButton"
								>
									Resend OTP
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="authFooter">
				<span className="authFooterText">New User?</span>
				<Button color="primary" onClick={() => history.push("/register")}>
					Register
				</Button>
			</div>
		</div>
	);
};

export default Login;
