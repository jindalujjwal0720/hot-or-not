import React, { useEffect, useRef, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { users, validEmails } from "../../assets/data/users";
import * as faceapi from "face-api.js";
import axios from "axios";
import "./../../combined.css";

const RegisterPage = () => {
  const nameRef = useRef();
  const instituteEmailRef = useRef();
  const yearRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isImageCorrect, setIsImageCorrect] = useState(false);
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const navigate = useNavigate();
  const [ip, setIP] = useState("");

  const getIP = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data);
    setIP(res.data.ip);
  };

  const checkImageValid = async () => {
    console.log("checking image for faces");
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    const detections = await faceapi.detectAllFaces("selected-image");
    if (detections.length <= 0) throw "Image has no face in it.";
    else if (detections.length > 1) throw "Image has multiple faces in it.";
  };

  const checkValidEmail = (email) => {
    // return true;
    return validEmails.includes(email.toLowerCase());
  };

  const setUserDataAssociatedWithEmail = (email) => {
    const emailUser = users.filter(
      (user) => user.email === email.toLowerCase()
    )[0];
    console.log(emailUser);
    const d = new Date();
    yearRef.current.value = d.getFullYear() - emailUser.year_of_admission;
    nameRef.current.value = emailUser.name;
  };

  const handleChange = () => {
    setError("");
    const nameFlag = nameRef.current.value && nameRef.current.value.length >= 3;
    const emailFlag = checkValidEmail(instituteEmailRef.current.value);
    const yearFlag = yearRef.current.value >= 0 && yearRef.current.value <= 5;
    const passwordFlag =
      passwordRef.current.value.length >= 6 &&
      passwordRef.current.value === confirmPasswordRef.current.value;
    const imageFlag = isImageCorrect && image != null;
    if (!emailFlag) setError("Please enter a valid IIT(ISM) email");
    else if (!nameFlag) setError("Please enter a valid name");
    else if (!yearFlag) setError("Please enter a valid study year");
    else if (!passwordFlag) setError("Passwords don't match");
    else if (!imageFlag) setError("Please choose an image");
    else setError("");
    const flag = nameFlag && yearFlag && passwordFlag && imageFlag && !loading;
    setCanSubmit(flag);
  };

  const handleEmailChange = () => {
    const emailFlag = checkValidEmail(instituteEmailRef.current.value);
    if (!emailFlag) setError("Please enter a valid IIT(ISM) email");
    else {
      setError("");
      setUserDataAssociatedWithEmail(instituteEmailRef.current.value);
      handleChange();
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const user = {
        email: instituteEmailRef.current.value,
        password: passwordRef.current.value,
        name: nameRef.current.value,
        yearOfStudy: yearRef.current.value,
        image: imageFile,
        lastEdited: Date.now(),
      };
      await signup(user);
      const ipkey = "userIDwithIP";
      localStorage.setItem(ipkey, "true");
      navigate("/leaderboard");
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (currentUser) navigate("/leaderboard");
    getIP().then(() => {
      const ipkey = "userIDwithIP";
      const value = localStorage.getItem(ipkey);
      if (!value) return;
      alert(
        `An account is already linked with this IP address: ${ip}.\nIf you forgot your password, we can help you at login page.`
      );
      navigate("/login");
    });
  }, []);

  useEffect(handleChange, [image, isImageCorrect]);

  const onImageChange = (event) => {
    setImageError("");
    setLoading(true);
    setIsImageCorrect(false);
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      console.log(image);
      setImageFile(event.target.files[0]);
      checkImageValid()
        .then(() => {
          console.log("image file correct");
          setImageError("");
          setLoading(false);
          setIsImageCorrect(true);
        })
        .catch((err) => {
          setImageError(err);
          setCanSubmit(false);
          setImage(null);
          setImageFile(null);
          setLoading(false);
        });
    }
  };

  return (
    <div className="login-container" style={{ height: window.innerHeight }}>
      <div className="header">
        <div className="header-content">
          <label className="choose-file-label" htmlFor="choose-image">
            {image ? (
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
          {imageError !== "" && (
            <div className="error-message">{imageError.toString()}</div>
          )}
          <input
            type="file"
            onChange={(e) => {
              onImageChange(e);
              console.log(image);
              handleChange(e);
            }}
            className="choose-file"
            accept="image/png, image/gif, image/jpeg, image/jpg"
            id="choose-image"
          />
        </div>
      </div>
      <div className="content-footer-container">
        <div className="content">
          <form className="form" onSubmit={handleSubmit}>
            <input
              ref={instituteEmailRef}
              className="input"
              type="email"
              placeholder="Institute Email"
              name="email"
              onChange={handleEmailChange}
            ></input>
            <input
              ref={nameRef}
              className="input"
              type="text"
              placeholder="Name"
              name="fullname"
              onChange={handleChange}
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
            ></input>
            <input
              ref={passwordRef}
              className="input"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            ></input>
            <input
              ref={confirmPasswordRef}
              className="input"
              type="password"
              placeholder="Confirm Password"
              name="password"
              onChange={handleChange}
            ></input>
            {error !== "" && (
              <div className="error-message">{error.toString()}</div>
            )}
            <button
              className="login-button"
              type="submit"
              disabled={!canSubmit || loading}
            >
              Register
            </button>
          </form>
        </div>
        <div className="footer">
          <span className="TnC">
            By registering, you are agreeing to the Terms and Conditions
          </span>
          <div className="create-account">
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "none" }}>
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
