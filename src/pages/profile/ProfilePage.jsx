import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import fireheart from "./../../assets/images/fire_heart.svg";
import { useAuth } from "../../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import leaderboard from "./../../assets/images/leaderboard.svg";
import { firestore } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./profile.css";
import "./../../combined.css";
import * as faceapi from "face-api.js";
import axios from "axios";

const ProfilePage = () => {
  const nameRef = useRef();
  const yearRef = useRef();
  const { currentUser, logout, update } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
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
    handleChange();
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
      await requestUser();
    } catch (err) {
      setError(err);
    }
    setLoading(false);
    toggleEditProfile();
  }

  const cancelEdit = (e) => {
    e.preventDefault();
    setCanSubmit(false);
    setEditProfile(false);
    setImage(thisUser.image.url);
    setImageFile(null);
    setError("");
    setImageError("");
    setLoading(false);
    setImageLoading(false);
  };

  const checkImageValid = async () => {
    setImageLoading(true);
    setImageError("");
    console.log("checking image for faces");
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    const detections = await faceapi.detectAllFaces("selected-image");
    console.log(detections);
    if (detections.length <= 0) throw "Image has no face in it.";
    else if (detections.length > 1) throw "Image has multiple faces in it.";
    setImageLoading(false);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setImageFile(event.target.files[0]);
      checkImageValid()
        .then(() => {
          console.log("image file correct");
          setImageError("");
        })
        .catch((err) => {
          setImageError(err);
          setCanSubmit(false);
          setImage(thisUser.image.url);
          setImageFile(null);
          setImageLoading(false);
        });
    }
    handleChange();
  };

  const requestUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/user/${currentUser.uid}`, {
        headers: {
          "x-auth-token-header": `BEARER ${accessToken}`,
        },
      })
      .then((res) => {
        setThisUser(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchThisUser = async () => {
      setLoading(true);
      requestUser();
    };
    try {
      fetchThisUser().then(() => console.log(thisUser));
    } catch (err) {
      setError(err);
    }
  }, [currentUser]);

  return (
    <div>
      <div className="header-bar">
        <h1 className="heading">Profile</h1>
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
                  {thisUser.image ? (
                    <img
                      className="selected-image-preview"
                      alt="DP"
                      src={image}
                      id="selected-image"
                    />
                  ) : (
                    <div className="selected-image-preview">Choose Image</div>
                  )}
                </label>
                <input
                  type="file"
                  onChange={onImageChange}
                  className="choose-file"
                  accept="image/png, image/gif, image/jpeg, image/jpg"
                  id="choose-image"
                  disabled={!editProfile || loading}
                />
                {imageError !== "" && (
                  <div className="error-message">{imageError.toString()}</div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px auto",
                  }}
                >
                  <span
                    style={{
                      color: "#7662e9",
                      fontWeight: "600",
                      paddingRight: "8px",
                      fontSize: "20px",
                    }}
                  >
                    {thisUser.firehearts}
                  </span>
                  <img width={30} src={fireheart} alt="fireheart"></img>
                  <span
                    style={{
                      color: "#7662e9",
                      fontWeight: "600",
                      paddingRight: "8px",
                      paddingLeft: "12px",
                      fontSize: "20px",
                    }}
                  >
                    #{thisUser.rank}
                  </span>
                </div>
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
                      ((!canSubmit || loading) && editProfile) ||
                      loading ||
                      imageLoading
                    }
                  >
                    {imageLoading
                      ? "Image loading..."
                      : editProfile
                      ? "Update Information"
                      : "Click to edit"}
                  </button>
                  {editProfile && (
                    <button className="cancel-edit-button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="share-div">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 600,
            color: "purple",
          }}
        >
          Spread firehearts{" "}
          <img width={28} height={28} src={fireheart} alt="fireheart"></img>
        </span>
        <button
          className="share-button-long"
          onClick={() => {
            navigator.clipboard
              .writeText(
                "Wanna check hot people in ISM? Try Hotboard.\n\nClick here - https://hotboard.netlify.app/"
              )
              .then(() => {
                alert("Copied Successfully. Thank you, popular buddy.");
              })
              .catch((e) =>
                alert(
                  "Failed to copy link, you can copy it from the browser directly."
                )
              );
          }}
        >
          Copy link
        </button>
      </div>
      <div className="bottom-navigation-bar-space-drop"></div>
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

export default ProfilePage;
