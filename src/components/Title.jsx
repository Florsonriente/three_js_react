// Title.jsx
import React from 'react';

const Title = ({ text }) => {
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: '3rem',
        color: 'white',
        margin: '20px 0',
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {text}
    </div>
  );
};

export default Title;
