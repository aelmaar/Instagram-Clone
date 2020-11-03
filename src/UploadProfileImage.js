import React from "react";
import { Fab, Avatar } from "@material-ui/core";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";

function UploadProfileImage({
	enable,
	imageProfil,
	handleImageProfil,
	onclick,
}) {
	return (
		<form className="form_update_image">
			<div className="center_image_profil">
				<Avatar src={imageProfil} alt="" className="avatar" />
				<input
					accept="image/*"
					className="file"
					id="contained-button-file"
					multiple
					type="file"
					onChange={handleImageProfil}
				/>
				<label htmlFor="contained-button-file">
					<Fab component="span" className="">
						<AddPhotoAlternateIcon />
					</Fab>
				</label>
				<button type="submit" onClick={onclick} disabled={enable}>
					upload
				</button>
			</div>
		</form>
	);
}

export default UploadProfileImage;
