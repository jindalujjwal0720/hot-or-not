import React, { useCallback, useEffect, useState } from "react";
import "./showcase.css";
import TinderCard from "react-tinder-card";

export const SwipeCard = ({ index, image, childRef, onSwiped, onDone }) => {
  const [cardLeft, setCardLeft] = useState(false);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    if (cardLeft) onDone(direction, index);
    // console.log(cardLeft, direction);
  }, [cardLeft]);

  return (
    <TinderCard
      ref={childRef}
      onSwipe={(dir) => {
        onSwiped(index, dir);
        setDirection(dir);
      }}
      onCardLeftScreen={() => {
        setCardLeft(true);
      }}
      preventSwipe={["up", "down"]}
    >
      <div
        className="swipe-card"
        style={{ background: `url(${image}) center no-repeat` }}
      ></div>
    </TinderCard>
  );
};
