import React from "react";
import "./leaderboard.css";
import rays from "./../../assets/images/back_rays.png";
import { FaCrown } from "react-icons/fa";

export const FirstSecondThird = () => {
  return (
    <div className="firstsecondthird-container">
      <img className="rank-1-rays" src={rays} alt="IMG"></img>
      <div className="fst-user-container">
        <div>
          <img
            className="user-display-image rank-2"
            src="https://source.unsplash.com/200x200?q=man"
            alt="IMG"
          ></img>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="rank-2-tag">2</div>
          <span className="user-name-fst">Esther Howard</span>
        </div>
      </div>
      <div className="fst-user-container">
        <FaCrown className="crown-icon" size={36} color="goldenrod" />
        <div>
          <img
            className="user-display-image rank-1"
            src="https://source.unsplash.com/200x200?q=woman"
            alt="IMG"
          ></img>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="rank-1-tag">1</div>
          <span className="user-name-fst">Esther Howard</span>
        </div>
      </div>
      <div className="fst-user-container">
        <div>
          <img
            className="user-display-image rank-3"
            src="https://source.unsplash.com/200x200?q=human"
            alt="IMG"
          ></img>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="rank-3-tag">3</div>
          <span className="user-name-fst">Esther Howard</span>
        </div>
      </div>
    </div>
  );
};
