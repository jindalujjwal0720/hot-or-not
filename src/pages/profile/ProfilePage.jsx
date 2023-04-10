import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import fireheart from "./../../assets/images/fire_heart.svg";
import { useAuth } from "../../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import leaderboard from "./../../assets/images/leaderboard.svg";
import { firestore } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./profile.css";

export const ProfilePage = () => {
  const nameRef = useRef();
  const yearRef = useRef();
  const { currentUser, logout, update } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState(currentUser.photoURL);
  const [canSubmit, setCanSubmit] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [thisUser, setThisUser] = useState(null);

  const handleChange = () => {
    const nameFlag = nameRef.current.value && nameRef.current.value.length >= 3;
    const yearFlag = yearRef.current.value >= 0 && yearRef.current.value <= 5;
    const imageFlag = image != null;
    if (!nameFlag) setError("Please enter a valid name");
    else if (!yearFlag) setError("Please enter a valid study year");
    else if (!imageFlag) setError("Please choose an image");
    else setError("");
    const flag = nameFlag && yearFlag && imageFlag;
    setCanSubmit(flag);
  };

  const toggleEditProfile = () => {
    setEditProfile((edit) => !edit);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!editProfile) {
      return toggleEditProfile();
    }
    try {
      setError("");
      setLoading(true);
      const user = {
        image: imageFile,
      };
      if (nameRef.current.value !== thisUser.name)
        user["name"] = nameRef.current.value;
      if (yearRef.current.value !== thisUser.yearOfStudy)
        user["yearOfStudy"] = yearRef.current.value;
      await update(user);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
    toggleEditProfile();
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setImageFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchThisUser = async () => {
      setLoading(true);
      const docRef = doc(firestore, `users/${currentUser.uid}`);
      getDoc(docRef).then((docSnap) => {
        setThisUser(docSnap.data());
        setLoading(false);
      });
    };
    try {
      fetchThisUser();
    } catch (err) {
      setError(err);
    }
  }, [currentUser]);

  return (
    <div>
      <div className="header-bar">
        <h1 className="heading">Hotboard</h1>
        <div className="navigation-buttons">
          <Link to="/showcase">
            <button>
              <img src={fireheart} alt="fireheart"></img>
            </button>
          </Link>
          <Link to="/leaderboard">
            <button>
              <img src={leaderboard} alt="leaderboard"></img>
            </button>
          </Link>
          {currentUser && (
            <button onClick={logout}>
              <FiLogOut size={20} color="purple" />
            </button>
          )}
        </div>
      </div>
      <div className="profile-login-container login-container">
        {error !== "" && <div className="error-div">{error.toString()}</div>}
        {thisUser && !loading && (
          <>
            <div className="header">
              <div className="header-content">
                <label className="choose-file-label" htmlFor="choose-image">
                  {image ? (
                    <img
                      className="selected-image-preview"
                      alt="DP"
                      src={image}
                    />
                  ) : (
                    <div className="selected-image-preview">Choose Image</div>
                  )}
                </label>
                <input
                  type="file"
                  onChange={onImageChange}
                  className="choose-file"
                  accept="image/png, image/gif, image/jpeg"
                  id="choose-image"
                />
              </div>
            </div>
            <div className="content-footer-container">
              <div className="content">
                <form className="form" onSubmit={handleSubmit}>
                  <input
                    ref={nameRef}
                    className="input"
                    type="text"
                    placeholder="Name"
                    name="fullname"
                    onChange={handleChange}
                    defaultValue={thisUser.name}
                    disabled={!editProfile}
                  ></input>
                  <input
                    className="input"
                    type="email"
                    placeholder="Institute Email"
                    name="email"
                    defaultValue={currentUser.email}
                    disabled={true}
                  ></input>
                  <input
                    ref={yearRef}
                    className="input"
                    type="number"
                    placeholder="Year of study"
                    name="year"
                    max={5}
                    min={0}
                    step={1}
                    onChange={handleChange}
                    defaultValue={thisUser.yearOfStudy}
                    disabled={!editProfile}
                  ></input>
                  <button
                    className="login-button"
                    type="submit"
                    disabled={
                      ((!canSubmit || loading) && editProfile) || loading
                    }
                  >
                    Update Information
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="bottom-navigation-bar">
        <Link to="/showcase">
          <button>
            <img src={fireheart} alt="fireheart"></img>
          </button>
        </Link>
        <Link to="/leaderboard">
          <button>
            <img src={leaderboard} alt="leaderboard"></img>
          </button>
        </Link>
        {currentUser && (
          <button onClick={logout}>
            <FiLogOut size={20} color="purple" />
          </button>
        )}
      </div>
    </div>
  );
};
