import React from "react";
import fireheart from "./../../assets/images/fire_heart.svg";

export const Loading = () => {
  return (
    <div>
      <div>
        <img
          style={{
            width: "100px",
            height: "100px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          src={fireheart}
          alt="loading..."
        ></img>
      </div>
    </div>
  );
};
