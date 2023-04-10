import React, { useEffect, useRef, useState } from "react";
import { SwipeCard } from "../../components/showcase/SwipeCard";
import "./showcase.css";
import fireHeart from "./../../assets/images/fire_heart.svg";
import { ImCross } from "react-icons/im";
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
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../utils/firebase";

export const ShowcasePage = () => {
  const [lastDirection, setLastDirection] = useState(null);
  const [list, setList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(list.length - 1);
  const currentIndexRef = useRef(null);
  const [childRefs, setChildRefs] = useState(null);
  const { logout, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thisUser, setThisUser] = useState(null);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const removeCard = (direction) => {
    // console.log(`${currentIndex} removing... in direction ${direction}`);
    swipe(direction);
  };

  // set last direction and decrease current index
  const swiped = (index, direction) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const canSwipe = currentIndex >= 0;

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < list.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  const calculateIncrementInFireHearts = (dir, index) => {
    const ScalingFactor = 100,
      IncrementFactor = 20;
    const A = dir === "right";
    const B = list[index].firehearts >= thisUser.firehearts;
    const sign = A ? 1 : -1;
    const d = Math.abs(list[index].firehearts - thisUser.firehearts);
    const p = 1 / (1 + Math.pow(10, d / ScalingFactor));
    const delta = sign * IncrementFactor * Math.abs(!(A ^ B) - p);
    const R = Math.floor(list[index].firehearts + delta);
    return R - list[index].firehearts;
  };

  const alreadyFireheartGivenToUser = (index) => {
    const id = list[index].id;
    const key = "firehearts";
    const firehearts = sessionStorage.getItem(key);
    if (!firehearts) return false;
    const listOfFirehearts = JSON.parse(firehearts);
    return listOfFirehearts.includes(id);
  };

  // write logic here
  const onCardGone = async (dir, index) => {
    if (index >= 0 && !alreadyFireheartGivenToUser(index)) {
      // calculation of change of firehearts
      const increment = calculateIncrementInFireHearts(dir, index);
      // increment the value in firestore
      const docRef = doc(firestore, `users/${list[index].id}`);
      updateDoc(docRef, {
        firehearts: list[index].firehearts + increment,
        lastEdited: Date.now(),
      }).then(() => {
        console.log("Firehearts Updated");
        // updating in session storage
        const key = "firehearts";
        const firehearts = sessionStorage.getItem(key);
        if (!firehearts) {
          const listOfFirehearts = [list[index].id];
          sessionStorage.setItem(key, JSON.stringify(listOfFirehearts));
        } else {
          const listOfFirehearts = [...JSON.parse(firehearts), list[index].id];
          sessionStorage.setItem(key, JSON.stringify(listOfFirehearts));
        }
      });
    }
  };

  useEffect(() => {
    const fetchRandomUsers = async () => {
      setLoading(true);
      console.count("Fetch Showcase");
      const q = query(
        collection(firestore, "users"),
        orderBy("lastEdited"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      let randomList = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        randomList.push(doc.data());
      });
      randomList = randomList.filter((user) => user.id !== currentUser.uid);
      setList(randomList);
      setLoading(false);
      updateCurrentIndex(randomList.length - 1);
      setChildRefs(
        Array(randomList.length)
          .fill(0)
          .map((i) => React.createRef())
      );
    };

    const fetchThisUser = async () => {
      setLoading(true);
      const docRef = doc(firestore, `users/${currentUser.uid}`);
      getDoc(docRef).then((docSnap) => {
        setThisUser(docSnap.data());
        setLoading(false);
      });
    };
    try {
      fetchThisUser();
      fetchRandomUsers();
    } catch (err) {
      setError(err);
    }
  }, []);

  return (
    <div className="showcase-page-container">
      <div className="header-bar">
        <h1 className="heading">Hotboard</h1>
        <div className="navigation-buttons">
          <Link to="/leaderboard">
            <button>
              <img src={leaderboard} alt="leaderboard"></img>
            </button>
          </Link>
          <button onClick={logout}>
            <FiLogOut size={20} color="purple" />
          </button>
          {currentUser && currentUser.photoURL && (
            <Link to="/profile">
              <button className="profile-image-button">
                <img src={currentUser.photoURL} alt="fireheart"></img>
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="swipe-cards-container">
        {loading && <div>Loading...</div>}
        {!loading && currentIndex < 0 && (
          <div style={{ color: "purple" }}>Are you feeling good?</div>
        )}
        {!loading &&
          list.map((user, index) => (
            <SwipeCard
              childRef={childRefs[index]}
              key={index}
              index={index}
              image={user.image}
              removeCard={removeCard}
              onSwiped={swiped}
              onDone={onCardGone}
            />
          ))}
      </div>
      <div className="swipe-buttons">
        <button onClick={() => removeCard("left")}>
          <ImCross size={20} color="#ec75f6" />
        </button>
        <button onClick={() => removeCard("right")}>
          <img src={fireHeart} alt="fireheart"></img>
        </button>
      </div>
      <div className="bottom-navigation-bar">
        <Link to="/leaderboard">
          <button>
            <img src={leaderboard} alt="leaderboard"></img>
          </button>
        </Link>
        {currentUser && currentUser.photoURL && (
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
