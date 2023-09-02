import React, { useEffect, useState } from 'react';
import '../styles/TypewriterAnimation.css'; // Import the CSS file for the component

const TypewriterAnimation = ({ userName }) => {
  // const { logout, user } = UserAuth();
  const [displayText, setDisplayText] = useState(` `);

  useEffect(() => {

    if (userName === undefined) {

    }
    else {

      animateText();
    }
  },);

  const animateText = () => {
    setDisplayText(`Hello ${userName}`); // Set the display text to the user's display name
  };

  return (
    <div className="typewriter-animation">
      <h1 className="heading">{displayText}</h1>
    </div>
  );

};

export default TypewriterAnimation;





