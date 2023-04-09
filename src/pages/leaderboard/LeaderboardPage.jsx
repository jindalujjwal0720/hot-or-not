import React from "react";
import "./leaderboard.css";
import { LeaderboardTile } from "../../components/leaderboard/LeaderboardTile";
import { FirstSecondThird } from "../../components/leaderboard/FirstSecondThird";

export const LeaderboardPage = () => {
  return (
    <div className="page-container">
      <h1 className="heading">Hotboard</h1>
      <FirstSecondThird />
      <LeaderboardTile
        rank={1}
        fires={34}
        name={"Edward Jenner"}
        yearOfStudy={1}
      />
      <LeaderboardTile
        rank={2}
        fires={30}
        name={"Kyle Smith"}
        yearOfStudy={1}
      />
      <LeaderboardTile
        rank={3}
        fires={27}
        name={"Samudra Mitra"}
        yearOfStudy={2}
      />
      <LeaderboardTile
        rank={4}
        fires={20}
        name={"Vishal Shrivastava"}
        yearOfStudy={2}
      />
      <LeaderboardTile rank={5} fires={6} name={"Cprakash"} yearOfStudy={2} />
    </div>
  );
};
