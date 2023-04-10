import React, { useEffect, useRef, useState } from "react";
import "./login.css";
import fireHeart from "./../../assets/images/fire_heart.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LoginPage = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, resetPassword, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [passwordResetMailSent, setPasswordResetMailSent] = useState(false);
  const navigate = useNavigate();

  const emailRegex = new RegExp("^[a-zA-Z0-9+_.-]+@iitism.ac.in");

  const handleChange = () => {
    const emailFlag = emailRef && emailRegex.test(emailRef.current.value);
    const passwordFlag = passwordRef.current.value.length >= 6;
    if (!emailFlag) setError("Please enter a valid IIT(ISM) email");
    else if (!passwordFlag) setError("Please enter a valid password");
    else setError("");
    const flag = emailFlag && passwordFlag;
    setCanSubmit(flag);
  };

  async function handleForgotPassword(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      setPasswordResetMailSent(true);
      await resetPassword(emailRef.current.value);
    } catch (err) {
      setError(err);
      setPasswordResetMailSent(false);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const user = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      await login(user);
      navigate("/leaderboard");
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (currentUser) navigate("/leaderboard");
  }, []);

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
          <form className="form" onSubmit={handleSubmit}>
            <input
              ref={emailRef}
              className="input"
              type="email"
              placeholder="Institute Email"
              onChange={handleChange}
              id="email"
            ></input>
            <input
              ref={passwordRef}
              className="input"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              id="password"
            ></input>
            {error !== "" && (
              <div className="error-message">{error.toString()}</div>
            )}
            <button
              className="login-button"
              type="submit"
              disabled={!canSubmit || loading}
            >
              Login
            </button>
            {passwordResetMailSent ? (
              <div className="forgot-password-mail-sent">
                A password reset link has been sent to {emailRef.current.value}
              </div>
            ) : (
              <div
                className="forgot-password"
                onClick={handleForgotPassword}
                style={{ cursor: "pointer" }}
              >
                Forgot Password?
              </div>
            )}
          </form>
        </div>
        <div className="footer">
          <div className="create-account">
            Don't have an account?{" "}
            <Link to="/register" style={{ textDecoration: "none" }}>
              <span>Create</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
