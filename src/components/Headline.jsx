import React from "react";

const Headline = () => {
  return (
    <div
      style={{
        width: "100%",
        padding: "50px 0",
        textAlign: "center",
        fontSize: "12rem",
        fontWeight: "bold",
        color: "red",
        position: "realtive",
        zIndex: "2", // Set a high z-index value
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Adds a transparent background to enhance readability
        fontFamily: "'Sunwish Maverick', Impact, 'Arial Narrow Bold', sans-serif",
       
      }}
    >
      Before & After Comparison
    </div>
  );
};

export default Headline;
