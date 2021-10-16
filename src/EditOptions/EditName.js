import React, { useState, useContext } from "react";
import userContext from "../Context/userContext";
import { db } from "../Context/firebase";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const EditName = ({ currentName, handleNameClose }) => {
	const { userData } = useContext(userContext);
	const [newName, setNewName] = useState(currentName);

	const handleEditName = () => {
		if (userData.uid && currentName !== newName) {
			db.collection("userData")
				.doc(userData.uid)
				.update({ name: newName })
				.then(() => !handleNameClose && window.location.reload())
				.catch((error) => alert(error.message));
		}

		if (handleNameClose) handleNameClose();
	};

	return (
		<Dialog open onClose={handleNameClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Edit your name</DialogTitle>
			<DialogContent>
				<DialogContentText>
					The name will be changed everywhere in the Whiteboard App
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					label="Enter name"
					type="text"
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleNameClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleEditName} color="primary">
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditName;
