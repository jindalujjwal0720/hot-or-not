import React from "react";
import "./leaderboard.css";
import rays from "./../../assets/images/back_rays.png";
import { FaCrown } from "react-icons/fa";

export const FirstSecondThird = ({ first, second, third }) => {
  return (
    <div className="firstsecondthird-container">
      <img className="rank-1-rays" src={rays} alt="IMG"></img>
      <div className="fst-user-container">
        <div>
          <img
            className="user-display-image rank-2"
            src={second.image}
            alt="2nd"
          ></img>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="rank-2-tag">2</div>
          <span className="user-name-fst">{second.name}</span>
        </div>
      </div>
      <div className="fst-user-container">
        <FaCrown className="crown-icon" size={36} color="goldenrod" />
        <div>
          <img
            className="user-display-image rank-1"
            src={first.image}
            alt="1st"
          ></img>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="rank-1-tag">1</div>
          <span className="user-name-fst">{first.name}</span>
        </div>
      </div>
      <div className="fst-user-container">
        <div>
          <img
            className="user-display-image rank-3"
            src={third.image}
            alt="3rd"
          ></img>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="rank-3-tag">3</div>
          <span className="user-name-fst">{third.name}</span>
        </div>
      </div>
    </div>
  );
};
