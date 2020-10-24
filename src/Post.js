import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@material-ui/core";
import { db } from "./firebase";
import firebase from "firebase";

function Post({ post, postId, user }) {
	const { username, caption, imageUrl, imageProfil } = post;
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	// here where i add comments
	const handleComment = (e) => {
		e.preventDefault();
		if (comment) {
			db.collection("posts").doc(postId).collection("comments").add({
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				comment: comment,
				username: user,
			});
			setComment("");
		}
	};
	// here where it took a snaphot of the comment section 
	useEffect(() => {
		let unsubscriber;
		if (postId) {
			unsubscriber = db
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.orderBy("timestamp", "asc")
				.onSnapshot((snapshot) => {
					setComments(
						snapshot.docs.map((doc) => ({
							id: doc.id,
							text: doc.data(),
						}))
					);
				});
		}
		return () => {
			unsubscriber();
		};
	}, [postId]);

	return (
		<div className="post">
			<header className="post__header">
				<div className="post__avatar">
					<Avatar src={imageProfil} />
					<h4>{username}</h4>
				</div>
			</header>
			<img src={imageUrl} alt={username} className="post__image" />
			<h4 className="post__caption">
				<strong>{username}</strong> {caption}
			</h4>
			{comments.map(({ id, text }) => (
				<h4 key={id} className="post__caption">
					<strong>{text.username}</strong> {text.comment}
				</h4>
			))}
			<form onSubmit={handleComment}>
				<input
					type="text"
					placeholder="comment her..."
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				<Button color="primary" type="submit">
					Post
				</Button>
			</form>
		</div>
	);
}

export default Post;
