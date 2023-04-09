import React from "react";
import "./leaderboard.css";
import { LeaderboardTile } from "../../components/leaderboard/LeaderboardTile";
import { FirstSecondThird } from "../../components/leaderboard/FirstSecondThird";

export const LeaderboardPage = () => {
  return (
    <div className="page-container">
      <h1>Leaderboard</h1>
      <FirstSecondThird />
      <LeaderboardTile />
      <LeaderboardTile />
      <LeaderboardTile />
      <LeaderboardTile />
    </div>
  );
};
