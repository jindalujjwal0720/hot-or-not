import React from "react";
// import "./login.css"
import "./log.css"

export const LoginPage = () => {
  return (
    <div className="loginContainer">
      <div className="new-account top">
        <img src="/z.png" alt="Love You" id="love"/>
      Flirt and meet new people
      </div>
      <div className="form-data">
        <input type="text" className="form-input" placeholder="Username"/>
        <input type="password" className="form-input" placeholder="Password"/>
      <button className="form-submit">Login</button>
      </div>
      <div className="new-account">
        Don't have an account?
        <div className="create">Create</div>
      </div>
    </div>
  );
};
