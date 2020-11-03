import React, { useState, useEffect, useRef } from "react";
import {
	Button,
	Modal,
	makeStyles,
	LinearProgress,
	TextField,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { PhotoCamera } from "@material-ui/icons";
import { db, storage } from "./firebase";
import firebase from "firebase";
import { auth } from "./firebase";
import CloseIcon from "@material-ui/icons/Close";
import {
	Snackbar,
	IconButton,
	Grow,
	Paper,
	Popper,
	MenuItem,
	MenuList,
	ClickAwayListener,
	Avatar,
} from "@material-ui/core";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	media: {
		height: 140,
	},
}));

function Header({ username, imageProfil }) {
	const [open, setOpen] = useState(false);
	const [openError, setOpenError] = useState(false);
	const [caption, setCaption] = useState("");
	const [imageUrl, setImageUrl] = useState(null);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState("");
	const [isDisabledButton,setIsDisabledButton] = useState(true)
	const [openMenu, setOpenMenu] = useState(false);
	const anchorRef = useRef(null);

	const [modalStyle] = useState(getModalStyle);
	const classes = useStyles();

	useEffect(() => {
		if (caption.length > 6 && imageUrl) setIsDisabledButton(false) 
		else setIsDisabledButton(true)
	}, [caption,imageUrl]);

	const handleChange = (e) => {
		const image = e.target.files[0];
		if (image) {
			const uploadTask = storage.ref("images/" + image.name).put(image);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = Math.round(
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					);
					setProgress(progress);
				},
				(error) => {
					setError(error.message);
					setOpenError(true);
				},
				() => {
					storage
						.ref("images/")
						.child(image.name)
						.getDownloadURL()
						.then((url) => {
							setImageUrl(url);
							setProgress(0);
						});
				}
			);
		}
	};

	const handleUpload = (e) => {
		e.preventDefault();
		if (imageUrl) {
			db.collection("posts")
				.add({
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					username: username,
					caption: caption,
					imageUrl: imageUrl,
					imageProfil: imageProfil,
				})
				.then(() => {
					setCaption("");
					setImageUrl(null);
					setOpen(false);
				})
				.catch((error) => {
					setOpenError(true);
					setError(error.message);
				});
		}
	};

	const handleListKeyDown = (event) => {
		if (event.key === "Tab") {
			event.preventDefault();
			setOpenMenu(false);
		}
	};
	return (
		<header className="app__header">
			<img
				src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
				alt=""
				className="app__headerImage"
			/>
			<button onClick={() => setOpen(true)}>
				<SendIcon fontSize="large" />
			</button>
			<Button
				ref={anchorRef}
				aria-controls={openMenu ? "menu-list-grow" : undefined}
				aria-haspopup="true"
				onClick={() => setOpenMenu((prevOpen) => !prevOpen)}
			>
				<Avatar src={imageProfil} alt="" />
			</Button>
			{/* this is for the logout button*/}
			<Popper
				open={openMenu}
				anchorEl={anchorRef.current}
				role={undefined}
				transition
				disablePortal
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin:
								placement === "bottom"
									? "center top"
									: "center bottom",
						}}
					>
						<Paper>
							<ClickAwayListener
								onClickAway={() => setOpenMenu(false)}
							>
								<MenuList
									autoFocusItem={openMenu}
									id="menu-list-grow"
									onKeyDown={handleListKeyDown}
								>
									<MenuItem onClick={() => auth.signOut()}>
										Logout
									</MenuItem>
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>

			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="form__upload" onSubmit={handleUpload}>
						<LinearProgress
							variant="determinate"
							value={progress}
						/>
						<div>
							<img src={imageUrl} alt="" className="image" />
							<label className="label__file" htmlFor="image">
								<IconButton
									color="primary"
									aria-label="upload picture"
									component="span"
								>
									<PhotoCamera />
								</IconButton>
							</label>
							<input
								accept="image/*"
								type="file"
								className="file"
								id="image"
								onChange={handleChange}
							/>
						</div>

						<TextField
							label="Caption"
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
						/>
						<Button
							className="btn_upload"
							variant="contained"
							color="primary"
							type="submit"
							disabled={isDisabledButton}
						>
							Upload
						</Button>
					</form>
				</div>
			</Modal>

			<Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				open={openError}
				autoHideDuration={6000}
				onClose={() => setOpenError(false)}
				message={error}
				action={
					<React.Fragment>
						<Button
							color="secondary"
							size="small"
							onClick={() => setOpenError(false)}
						>
							UNDO
						</Button>
						<IconButton
							size="small"
							aria-label="close"
							color="inherit"
							onClick={() => setOpenError(false)}
						>
							<CloseIcon fontSize="small" />
						</IconButton>
					</React.Fragment>
				}
			/>
		</header>
	);
}

export default Header;
