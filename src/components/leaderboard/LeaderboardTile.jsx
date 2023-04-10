import React from "react";
import "./leaderboard.css";
import fireHeart from "./../../assets/images/fire_heart_dark.svg";

export const LeaderboardTile = ({ rank, fires, name, yearOfStudy }) => {
  return (
    <div className="leaderboard-tile">
      <div style={{ display: "flex" }}>
        <div>
          <h2 className="user-rank">{rank > 9 ? rank : `0${rank}`}</h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3 className="user-name">{name}</h3>
          <span style={{ fontSize: "small", color: "rgb(145, 145, 145)" }}>
            Year {yearOfStudy}
          </span>
        </div>
      </div>
      <div className="user-display-image">
        <span
          style={{ color: "#7662e9", fontWeight: "500", paddingRight: "8px" }}
        >
          {fires}
        </span>
        <img width={24} src={fireHeart} alt="fireheart"></img>
      </div>
    </div>
  );
};
