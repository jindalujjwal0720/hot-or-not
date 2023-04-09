import React from "react";
import "./leaderboard.css";
import rays from "./../../assets/images/back_rays.png";
import { FaCrown } from "react-icons/fa";

export const FirstSecondThird = () => {
  return (
    <div className="firstsecondthird-container">
      <img className="rank-1-rays" src={rays} alt="IMG"></img>
      <div>
        <div className="user-display-image rank-2">
          <img src="https://source.unsplash.com/200x200?q=man" alt="IMG"></img>
          <div className="rank-2-tag">2</div>
        </div>
        <p>Esther Howard</p>
      </div>
      <div>
        <FaCrown className="crown-icon" size={36} color="goldenrod" />
        <div className="user-display-image rank-1">
          <img
            src="https://source.unsplash.com/200x200?q=woman"
            alt="IMG"
          ></img>
          <div className="rank-1-tag">1</div>
        </div>
        <p>Esther Howard</p>
      </div>
      <div>
        <div className="user-display-image rank-3">
          <img
            src="https://source.unsplash.com/200x200?q=human"
            alt="IMG"
          ></img>
          <div className="rank-3-tag">3</div>
        </div>
        <p>Esther Howard</p>
      </div>
    </div>
  );
};
