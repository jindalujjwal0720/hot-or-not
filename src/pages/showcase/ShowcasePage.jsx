import React from "react";
import { SwipeCard } from "../../components/showcase/SwipeCard";
import "./showcase.css";

export const ShowcasePage = () => {
  return (
    <div className="showcase-page-container">
      <div className="swipe-cards-container">
        <SwipeCard />
      </div>
    </div>
  );
};
