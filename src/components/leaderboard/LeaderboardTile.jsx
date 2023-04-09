import React from "react";
import "./leaderboard.css";
import { FaCrown } from "react-icons/fa";

export const LeaderboardTile = () => {
  return (
    <div className="leaderboard-tile">
      <div style={{ display: "flex" }}>
        <div>
          <h2 className="user-rank">01</h2>
        </div>
        <div>
          <h3 className="user-name">Esther Howard</h3>
          <p className="user-fires">{34} Fires</p>
        </div>
      </div>
      <div className="user-display-image">
        <img
          src="https://source.unsplash.com/random/200x200?q=person"
          alt="IMG"
        ></img>
      </div>
    </div>
  );
};
