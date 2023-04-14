import React, { useEffect, useState } from "react";
import "./showcase.css";
import leaderboard from "./../../assets/images/leaderboard.svg";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../../utils/firebase";
import { Choose } from "../../components/showcase/Choose";
import "./../../combined.css";
import axios from "axios";

const ShowcasePage = () => {
  const [list, setList] = useState(null);
  const { logout, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thisUser, setThisUser] = useState(null);

  useEffect(() => {
    const fetchRandomUsers = async () => {
      setLoading(true);
      console.count("Fetch Showcase");
      const accessToken = localStorage.getItem("accessToken");
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/random`, {
          headers: {
            "x-auth-token-header": `BEARER ${accessToken}`,
          },
        })
        .then((res) => {
          let randomList = res.data ?? [];
          randomList = randomList
            .filter((user) => user.id !== currentUser.uid)
            .reverse();
          setList(randomList);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const fetchThisUser = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      await axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/user/${currentUser.uid}`, {
          headers: {
            "x-auth-token-header": `BEARER ${accessToken}`,
          },
        })
        .then((res) => {
          setThisUser(res.data);
          setLoading(false);
        });
    };
    try {
      fetchThisUser();
      fetchRandomUsers();
    } catch (err) {
      setError(err);
    }
  }, [currentUser]);

  return (
    <div className="showcase-page-container">
      <div className="header-bar">
        <h1 className="heading">Chooose</h1>
        <div className="navigation-buttons">
          <Link to="/leaderboard">
            <button>
              <img src={leaderboard} alt="leaderboard"></img>
            </button>
          </Link>
          <button onClick={logout}>
            <FiLogOut size={20} color="purple" />
          </button>
          {currentUser && (
            <Link to="/profile">
              <button className="profile-image-button">
                <img src={currentUser.photoURL} alt="fireheart"></img>
              </button>
            </Link>
          )}
        </div>
      </div>
      {list && <Choose users={list} />}
      <div className="bottom-navigation-bar">
        <Link to="/leaderboard">
          <button>
            <img src={leaderboard} alt="leaderboard"></img>
          </button>
        </Link>
        {currentUser && (
          <Link to="/profile">
            <button className="profile-image-button">
              <img src={currentUser.photoURL} alt="fireheart"></img>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ShowcasePage;
