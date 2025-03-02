import React, { useState, useEffect } from "react";

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [trailPos, setTrailPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      requestAnimationFrame(() => {
        setTrailPos((prev) => ({
          x: prev.x + (e.clientX - prev.x) * 0.15,
          y: prev.y + (e.clientY - prev.y) * 0.15,
        }));
      });
    };

    const handleClick = (e) => {
      const newParticles = Array.from({ length: 10 }).map(() => ({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 0.006 + 0.2, // Random size
        alpha: 1, // Opacity starts at 1
        velocity: {
          x: (Math.random() - 0.5) * 986, // Random spread
          y: (Math.random() - 0.5) * 1236,
        },
      }));

      setParticles((prev) => [...prev, ...newParticles]);

      // Animate particles
      requestAnimationFrame(() => {
        setParticles((prev) =>
          prev.map((p) => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            alpha: p.alpha - 0.05, // Fade out
          })).filter((p) => p.alpha > 0) // Remove faded particles
        );
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {/* Main Cursor */}
      <div
        style={{
          position: "fixed",
          top: cursorPos.y,
          left: cursorPos.x,
          width: "10px",
          height: "10px",
          backgroundColor: "white",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.05s ease-out",
          zIndex: 9999,
          pointerEvents: "none",  // Allow mouse events to pass through
        }}
      />

      {/* Trailing Cursor */}
      <div
        style={{
          position: "fixed",
          top: trailPos.y,
          left: trailPos.x,
          width: "20px",
          height: "20px",
          backgroundColor: "rgba(255, 0, 221, 0.5)", // Orange glow
          borderRadius: "50%",
          transform: "translate(-50%, -50%) scale(10.2)", // Splash effect
          filter: "blur(8px)", // Glow effect
          transition: "transform 0.2s ease-out",
          zIndex: 9998,
          pointerEvents: "none",  // Allow mouse events to pass through
        }}
      />
    </>
  );
};

export default CustomCursor;
