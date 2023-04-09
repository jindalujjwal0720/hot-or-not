import React, { useState } from "react";
import "./login.css";

export const RegisterPage = () => {
  const [image, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

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
          <div className="form">
            <input
              className="input"
              type="text"
              placeholder="Name"
              name="fullname"
            ></input>
            <input
              className="input"
              type="email"
              placeholder="Institute Email"
              name="email"
            ></input>
            <input
              className="input"
              type="number"
              placeholder="Year of study"
              name="year"
              max={5}
              min={0}
              step={1}
            ></input>
            <input
              className="input"
              type="password"
              placeholder="Password"
              name="password"
            ></input>
            <button className="login-button" type="submit">
              Register
            </button>
          </div>
        </div>
        <div className="footer">
          <span className="TnC">
            By registering, you are agreeing to the Terms and Conditions
          </span>
          <div className="create-account">
            Already have an account? <span>Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};
