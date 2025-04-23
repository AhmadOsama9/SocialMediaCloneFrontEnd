// Updated Loader.jsx
import React from 'react';
import "../CSS/loader.css";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader__spinner">
          <div className="loader__spinner-outer"></div>
          <div className="loader__spinner-inner"></div>
        </div>
        {text && <div className="loader__text">{text}</div>}
      </div>
    </div>
  );
};

export default Loader;