import React, { useState, useEffect } from "react";
import Post from "./Post";
import Header from "./Header";
import { storage, db, auth } from "./firebase";
import UploadProfileImage from "./UploadProfileImage";
import { TextField, Button, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import InstagramEmbed from "react-instagram-embed";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [sign, setSign] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageProfil, setImageProfil] = useState("");
  const [error, setError] = useState("");
  const [isEnableBtn, setIsEnableBtn] = useState(true);
  const [isUserPhotoExist, setIsUserPhotoExist] = useState(false);
  // here it show me wheter the user is loggin or logout (the case of the user)
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setIsUserPhotoExist(true);
      } else {
        setUser("");
        setIsUserPhotoExist(false);
      }
    });
  }, [user, username]);
  // here it take a snapshot of the collection posts
  useEffect(() => {
    const unsubscriber = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
    return () => {
      unsubscriber();
    };
  }, []);
  // when i sign up, and here i update the profile
  //of the user when he signup to use it when i add a post
  const SignUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        setError(error.message);
        setOpen(true);
      });
  };
  // here sign in
  const SignIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        setError(error.message);
        setOpen(true);
      });
  };
  // here when i update picture of the user when he sign up or sign
  const handleImageProfil = (e) => {
    const image = e.target.files[0];
    if (image) {
      const uploadProfil = storage.ref("profils/" + image.name).put(image);
      uploadProfil.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          setError(error.message);
          setOpen(true);
        },
        () => {
          storage
            .ref("profils/")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              user.updateProfile({
                photoURL: url,
              });
              setImageProfil(url);
              setIsEnableBtn(false);
            });
        }
      );
    }
  };

  const handleClick = () => {
    setImageProfil("");
    setIsEnableBtn(true);
  };

  return (
    <div className="app">
      {!user ? (
        <div className="app__login">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
          {sign ? (
            <form onSubmit={SignIn} className="app__signin">
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="app__submit"
                type="submit"
                style={{
                  backgroundColor: "rgba(3, 115, 252,1)",
                  color: "white",
                }}
              >
                Log In
              </Button>
              <h5>
                don't have an account{" "}
                <button onClick={() => setSign(false)} type="button">
                  sign up
                </button>
              </h5>
            </form>
          ) : (
            <form onSubmit={SignUp} className="app__signin">
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="app__submit"
                type="submit"
                style={{
                  backgroundColor: "rgba(3, 115, 252,1)",
                  color: "white",
                }}
              >
                Sign Up
              </Button>
              <h5>
                already have an account?{" "}
                <button onClick={() => setSign(true)} type="button">
                  sign in
                </button>
              </h5>
            </form>
          )}
        </div>
      ) : (
        <div>
          {user?.photoURL && (
            <div>
              {/* here once the user has logged in or logged out and if the profil picture wasn't upload it
                 it show him to upload the image */}
              <Header imageProfil={user.photoURL} username={user.displayName} />
              <div className="app__posts">
                <div>
                  {posts.map(({ id, post }) => (
                    <Post
                      user={user.displayName}
                      postId={id}
                      key={id}
                      post={post}
                    />
                  ))}
                </div>
                <div>
                  <InstagramEmbed
                    url="https://instagr.am/p/Zw9o4/"
                    maxWidth={320}
                    hideCaption={false}
                    containerTagName="div"
                    protocol=""
                    injectScript
                    style={{ position: "sticky", zIndex: "-1" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* this is the snackbar where the error bar comes*/}
      {!user.photoURL && isUserPhotoExist && (
        <UploadProfileImage
          enable={isEnableBtn}
          imageProfil={imageProfil}
          handleImageProfil={handleImageProfil}
          onclick={handleClick}
        />
      )}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={error}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              size="small"
              onClick={() => setOpen(false)}
            >
              UNDO
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

export default App;
