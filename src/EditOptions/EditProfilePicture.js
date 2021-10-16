import React, { useState, useContext } from "react";
import {
	Modal,
	makeStyles,
	Typography,
	IconButton,
	Button,
	LinearProgress,
	Box,
} from "@material-ui/core";
import { Close, Image, DoubleArrowSharp, EditSharp } from "@material-ui/icons";
import userContext from "../Context/userContext";
import { db, storage } from "../Context/firebase";
import "./EditProfilePicture.css";

function LinearProgressWithLabel(props) {
	return (
		<Box display="flex" alignItems="center">
			<Box width="100%" mr={1}>
				<LinearProgress variant="determinate" {...props} />
			</Box>
			<Box minWidth={35}>
				<Typography variant="body2" color="textSecondary">{`${Math.round(
					props.value
				)}%`}</Typography>
			</Box>
		</Box>
	);
}

const useStyles = makeStyles((theme) => ({
	modal: {
		justifyContent: "center",
		margin: "1% 20%",
		"@media (max-width: 1200px)": {
			margin: "1% 13%",
		},
		"@media (max-width: 900px)": {
			margin: "1% 7%",
		},
		"@media (max-width: 600px)": {
			margin: "1%",
		},
		border: "0px solid #312e2e",
		height: "100%",
		textAlign: "center",
	},
	paperOptions: {
		backgroundColor: "rgb(240, 236, 236)",
		// border: "0px solid #312e2e",
		margin: "5% 25%",
		boxShadow: theme.shadows[5],
		borderRadius: 7,
		height: "40%",
	},
	paper: {
		backgroundColor: "rgb(240, 236, 236)",
		// border: "0px solid #312e2e",
		boxShadow: theme.shadows[5],
		borderRadius: 7,
		paddingTop: "1%",
		paddingBottom: "1%",
		marginBottom: "1%",
		height: "100%",
	},
	progressBar: {
		margin: "1% 5%",
	},
	photoPostOptions: {
		display: "grid",
		gridTemplateColumns: "50% 50%",
		textAlign: "center",
		justifyContent: "center",
	},
	postButton: {
		margin: "0% 30%",
		width: "40%",
	},
}));

const EditProfilePicture = ({ handleProfileClose }) => {
	const classes = useStyles();
	const { user } = useContext(userContext);
	const [preview, setPreview] = useState("");
	const [media, setMedia] = useState(null); // media refers to the media that will be uploaded
	const [uploading, setUploading] = useState(null); // refers to the percentage uploaded

	const upload = () => {
		if (!media) {
			alert("Please select the media to be uploaded");
			return;
		}
		if (user) {
			storage
				.ref(`userData/${user.uid}`)
				.put(media)
				.on(
					"state_changed",
					(next) => {
						setUploading(
							Math.round((next.bytesTransferred / next.totalBytes) * 100)
						);
					},
					(e) => alert(e.message),
					() => {
						// when media is successfully uploaded
						storage
							.ref(`userData/${user.uid}`)
							.getDownloadURL()
							.then((url) => {
								db.collection("userData").doc(user.uid).update({
									profileImageURL: url,
								});
								handleProfileClose();
							});
					}
				);
		}
	};

	const selectMedia = () => {
		// This function creates an input element and simulates a user click on in
		const fileInput = document.createElement("input");
		fileInput.setAttribute("type", "file");
		fileInput.accept = "image/*";
		fileInput.click();
		fileInput.onchange = (e) => {
			let file = e.target.files[0];
			if (file && file.type.startsWith("image")) {
				setMedia(file);
				let objectUrl = URL.createObjectURL(file);
				setPreview(objectUrl);
			} else {
				setMedia({ error: "Media type not supported" });
			}
		};
	};

	return (
		<Modal
			open
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			className={classes.modal}
		>
			{media ? (
				<div>
					<div className={classes.paper}>
						<div className="postUploadHeader">
							<IconButton className="iconButton" onClick={handleProfileClose}>
								<Close />
							</IconButton>
						</div>
						{media.name ? (
							<div className="photoPreview">
								<img src={preview} alt="preview" className="imagePreview" />
							</div>
						) : (
							<h1>{media.error}</h1>
						)}
						{uploading && (
							<div className={classes.progressBar}>
								<LinearProgressWithLabel value={uploading} />
							</div>
						)}
					</div>
					<div className={classes.photoPostOptions}>
						<Button
							variant="contained"
							color="primary"
							onClick={selectMedia}
							className={classes.postButton}
						>
							<EditSharp />
							{"  "}Change
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={upload}
							className={classes.postButton}
						>
							<DoubleArrowSharp />
							{"  "}Post
						</Button>
					</div>
				</div>
			) : (
				<div className={classes.paperOptions}>
					<div className="postUploadMain">
						<div className="postUploadHeader">
							<IconButton className="iconButton" onClick={handleProfileClose}>
								<Close htmlColor="#fff" />
							</IconButton>
						</div>
						<div className="profileImageUpload">
							<Image fontSize="large" />
							<Typography variant="h6">Select an Image to upload</Typography>
						</div>
						<Button
							variant="contained"
							color="primary"
							className="photoUploadOption"
							onClick={selectMedia}
						>
							Upload
						</Button>
					</div>
				</div>
			)}
		</Modal>
	);
};

export default EditProfilePicture;
