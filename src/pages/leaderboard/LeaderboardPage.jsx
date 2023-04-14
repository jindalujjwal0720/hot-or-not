import React, { useEffect, useState } from "react";
import "./leaderboard.css";
import { LeaderboardTile } from "../../components/leaderboard/LeaderboardTile";
import { FirstSecondThird } from "../../components/leaderboard/FirstSecondThird";
import fireheart from "./../../assets/images/fire_heart.svg";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { firestore } from "../../utils/firebase";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./../../combined.css";
import axios from "axios";

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { logout, currentUser } = useAuth();

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      console.count("Fetch leaderboard");
      const listOfLeaders = [];
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/leaderboard`, {
          count: 10,
        })
        .then((res) => {
          const listOfLeaders = res.data ?? [];
          setLeaders(listOfLeaders);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    try {
      fetchLeaders();
    } catch (err) {
      setError(err);
    }
  }, []);

  return (
    <div className="page-container">
      <div className="header-bar">
        <h1 className="heading">Hotboard</h1>
        <div className="navigation-buttons">
          <Link to="/showcase">
            <button>
              <img src={fireheart} alt="fireheart"></img>
            </button>
          </Link>
          {currentUser && (
            <button onClick={logout}>
              <FiLogOut size={20} color="purple" />
            </button>
          )}
          {!currentUser && (
            <Link to="/login">
              <button>
                <FiLogIn size={20} color="purple" />
              </button>
            </Link>
          )}
          {currentUser && (
            <Link to="/profile">
              <button className="profile-image-button">
                <img src={currentUser.photoURL} alt="fireheart"></img>
              </button>
            </Link>
          )}
        </div>
      </div>
      <div style={{ flex: "1" }}>
        {error !== "" && <div className="error-div">{error}</div>}
        {!loading && error === "" && (
          <div>
            {leaders.length >= 3 && (
              <FirstSecondThird
                first={leaders[0]}
                second={leaders[1]}
                third={leaders[2]}
              />
            )}
            {leaders.map((user, index) => (
              <LeaderboardTile
                key={index}
                rank={index + 1}
                fires={user.firehearts}
                name={user.name}
                yearOfStudy={user.yearOfStudy}
                image={user.image}
              />
            ))}
          </div>
        )}
      </div>
      <div style={{ height: "50px" }}></div>
      <div className="bottom-navigation-bar">
        <Link to="/showcase">
          <button>
            <img src={fireheart} alt="fireheart"></img>
          </button>
        </Link>
        {currentUser && (
          <Link to="/profile">
            <button className="profile-image-button">
              <img src={currentUser.photoURL} alt="profile"></img>
            </button>
          </Link>
        )}
        {!currentUser && (
          <Link to="/login">
            <button>
              <FiLogIn size={20} color="purple" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
