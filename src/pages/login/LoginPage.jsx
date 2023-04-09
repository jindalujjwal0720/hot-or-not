import React from "react";
import "./login.css";
import fireHeart from "./../../assets/images/fire_heart.svg";

export const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="header">
        <div className="header-content">
          <img className="header-logo" src={fireHeart} alt="fireheart"></img>
          Fire the hearts of people
        </div>
      </div>
      <div className="content-footer-container">
        <div className="content">
          <div className="form">
            <input
              className="input"
              type="email"
              placeholder="Institute Email"
            ></input>
            <input
              className="input"
              type="password"
              placeholder="Password"
            ></input>
            <button className="login-button" type="submit">
              Login
            </button>
            <div className="forgot-password">Forgot Password?</div>
          </div>
        </div>
        <div className="footer">
          <div className="create-account">
            Don't have an account? <span>Create</span>
          </div>
        </div>
      </div>
    </div>
  );
};
