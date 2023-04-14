import React, { useEffect, useState } from "react";
import fireheart from "./../../assets/images/fire_heart.svg";
import "./choose.css";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebase";
import { Loading } from "../error-loading/Loading";
import axios from "axios";

export const Choose = ({ users }) => {
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [allFinish, setAllFinish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allPairs, setAllPairs] = useState([]);

  const changeInFirehearts = (user1, user2, winner, calculatingFor) => {
    const K = 20;
    const r1 = user1.firehearts;
    const r2 = user2.firehearts;
    const d = (r1 - r2) / 400;
    const p1 = 1 / (1 + Math.pow(10, d));
    const p2 = 1 - p1;
    const S = winner.id === calculatingFor.id ? 1 : 0;
    if (calculatingFor.id === user1.id) return K * (S - p1);
    else return K * (S - p2);
  };

  const updateFirehearts = (userIncrease, userDecrease) => {
    // calculation of change of firehearts
    const deltaIncrease = Math.floor(
      changeInFirehearts(userIncrease, userDecrease, userIncrease, userIncrease)
    );
    const deltaDecrease = Math.floor(
      changeInFirehearts(userIncrease, userDecrease, userIncrease, userDecrease)
    );
    // increment the value in firestore for INCREASE user
    const accessToken = localStorage.getItem("accessToken");
    axios
      .patch(`${process.env.REACT_APP_API_BASE_URL}/increment`, {
        increment: deltaIncrease,
        id: userIncrease.id,
        headers: {
          "x-auth-token-header": `BEARER ${accessToken}`,
        },
      })
      .then(() => {
        console.log("Firehearts Increased for ", userIncrease.name);
      });
    axios
      .patch(`${process.env.REACT_APP_API_BASE_URL}/increment`, {
        increment: deltaDecrease,
        id: userIncrease.id,
        headers: {
          "x-auth-token-header": `BEARER ${accessToken}`,
        },
      })
      .then(() => {
        console.log("Firehearts Decreased for ", userDecrease.name);
      });
  };

  const handleClick = (e, user) => {
    setLoading(true);
    console.log(user.name);
    if (user.id === user1.id) {
      updateFirehearts(user1, user2);
    } else {
      updateFirehearts(user2, user1);
    }
    setPairToStorage(user1, user2);
    setUser1(null);
    setUser2(null);
    setCurrentIndex((ci) => ci - 1);
    setLoading(false);
  };

  const hasPair = (u1, u2, pairs) => {
    let flag = false;
    pairs.forEach((element) => {
      if (element[0].id === u1.id && element[1].id === u2.id) flag = true;
      else if (element[0].id === u2.id && element[1].id === u1.id) flag = true;
    });
    return flag;
  };

  const calculateAllValidPairs = (users) => {
    const pairs = [];
    for (let u1 of users) {
      for (let u2 of users) {
        if (!haveAlreadyPaired(u1, u2) && !hasPair(u1, u2, pairs)) {
          pairs.push([u1, u2]);
        }
      }
    }
    return JSON.parse(JSON.stringify(pairs));
  };

  const haveAlreadyPaired = (user1, user2) => {
    if (user1.id === user2.id) return true;
    const key = "userPairs";
    const value = localStorage.getItem(key);
    if (!value) return false;
    const arrayOfPairs = JSON.parse(value);
    let flag = false;
    arrayOfPairs.forEach((element) => {
      if (element[0] === user1.id && element[1] === user2.id) flag = true;
      else if (element[1] === user1.id && element[0] === user2.id) flag = true;
    });
    return flag;
  };

  const setPairToStorage = (user1, user2) => {
    const key = "userPairs";
    const value = localStorage.getItem(key);
    const arrayOfPairs = value ? JSON.parse(value) : [];
    arrayOfPairs.push([user1.id, user2.id]);
    localStorage.setItem(key, JSON.stringify(arrayOfPairs));
  };

  useEffect(() => {
    const randomPairs = calculateAllValidPairs(users).sort(
      (a, b) => 0.5 - Math.random()
    );
    setAllPairs(randomPairs);
    setCurrentIndex(randomPairs.length - 1);
  }, []);

  useEffect(() => {
    console.log(currentIndex);
    let index = currentIndex;
    if (allFinish) return setAllFinish(true);
    else if (index < 0) return setAllFinish(true);
    else if (allPairs.length > 0) {
      setUser1(allPairs[index][0]);
      setUser2(allPairs[index][1]);
    }
  }, [currentIndex]);

  return (
    <div
      className="choose-hot-container"
      style={{ height: `${window.innerHeight - 170}px` }}
    >
      {loading && <Loading />}
      {allFinish || !(user1 && user2) ? (
        <div
          style={{
            color: "purple",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: "0",
            minWidth: "230px",
          }}
        >
          Come back later for more.{" "}
          <img width={30} height={30} src={fireheart} alt="fireheart"></img>
        </div>
      ) : (
        <>
          <div
            className="choose-hot-image-container"
            onClick={(e) => handleClick(e, user1)}
          >
            <img src={user1.image} alt="User 1"></img>
          </div>
          <div
            style={{
              color: "purple",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: "0",
              minWidth: "230px",
            }}
          >
            Choose the hotest{" "}
            <img width={30} height={30} src={fireheart} alt="fireheart"></img>
          </div>
          <div
            className="choose-hot-image-container"
            onClick={(e) => handleClick(e, user2)}
          >
            <img src={user2.image} alt="User 2"></img>
          </div>
        </>
      )}
    </div>
  );
};
