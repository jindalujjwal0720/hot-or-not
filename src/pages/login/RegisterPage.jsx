import React, { useEffect, useRef, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const RegisterPage = () => {
  const nameRef = useRef();
  const instituteEmailRef = useRef();
  const yearRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const navigate = useNavigate();

  const emailRegex = new RegExp("^[a-zA-Z0-9+_.-]+@iitism.ac.in");

  const handleChange = () => {
    const nameFlag = nameRef.current.value && nameRef.current.value.length >= 3;
    const emailFlag =
      instituteEmailRef && emailRegex.test(instituteEmailRef.current.value);
    const yearFlag = yearRef.current.value >= 0 && yearRef.current.value <= 5;
    const passwordFlag =
      passwordRef.current.value.length >= 6 &&
      passwordRef.current.value === confirmPasswordRef.current.value &&
      !loading;
    const imageFlag = image != null;
    if (!nameFlag) setError("Please enter a valid name");
    else if (!emailFlag) setError("Please enter a valid IIT(ISM) email");
    else if (!yearFlag) setError("Please enter a valid study year");
    else if (!passwordFlag) setError("Passwords don't match");
    else if (!imageFlag) setError("Please choose an image");
    else setError("");
    const flag = nameFlag && emailFlag && yearFlag && passwordFlag && imageFlag;
    setCanSubmit(flag);
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
      navigate("/leaderboard");
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }

  const onImageChange = (event) => {
    setError("");
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setImageFile(event.target.files[0]);
    }
    handleChange();
  };

  useEffect(() => {
    if (currentUser) navigate("/leaderboard");
  }, []);

  return (
    <div className="login-container">
      <div className="header">
        <div className="header-content">
          <label className="choose-file-label" htmlFor="choose-image">
            {image ? (
              <img className="selected-image-preview" alt="DP" src={image} />
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
            ></input>
            <input
              ref={instituteEmailRef}
              className="input"
              type="email"
              placeholder="Institute Email"
              name="email"
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
