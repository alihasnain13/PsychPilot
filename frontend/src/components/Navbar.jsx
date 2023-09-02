import React from 'react';
//import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useState } from "react";
import "../styles/Navbar.css";
import axios from "axios";

const Navbar = ({ NavItem1, NavItem2, NavItem3 }) => {


  const { user, logOut } = UserAuth();

  const handleClick = () => {
    if (NavItem3 === 'End Session') {
      // Call the chatapi function here
      endSession();
    }
    else if (NavItem3 === 'Plan') {
      ChatHistory();
    }
  };


  const ChatHistory = () => {


    return new Promise(async (resolve, reject) => {
      try {

        user
          .getIdToken(true)
          .then(async (idToken) => {

            let response = (await axios.post(
              "http://localhost:3001/api/chathistory",
              {

              },
              {
                headers: {
                  Authorization: "Bearer " + idToken,
                },
              }
            ));

          })
          .catch((error) => {
            console.log("Error fetching ID Token:", error);
            reject(error); // Reject the Promise if there's an error
          });


      } catch (error) {
        console.log("Chat History Error:", error);
        reject(error); // Reject the Promise if there's an error
      }
    });
  };




  const endSession = () => {


    return new Promise(async (resolve, reject) => {
      try {

        user
          .getIdToken(true)
          .then(async (idToken) => {

            let response = (await axios.post(
              "http://localhost:3001/api/chatbot/end",
              {
                userID: user.uid,
              },
              {
                headers: {
                  Authorization: "Bearer " + idToken,
                },
              }
            ));

          })
          .catch((error) => {
            console.log("Error fetching ID Token:", error);
            reject(error); // Reject the Promise if there's an error
          });


      } catch (error) {
        console.log("Error End Session:", error);
        reject(error); // Reject the Promise if there's an error
      }
    });
  };

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.log(error)
    }
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const handleSettings = () => {
    // Handle settings logic here
  };

  return (

    <>
      <div className="TopBarNav" id="navbar">
        <div className="SectionNav">
          <a href="/account" className="LinkNav">
            {NavItem1}
          </a>
        </div>
        <div className="SectionNav">
          <a href="/Conversations" className="LinkNav">
            {NavItem2}
          </a>
        </div>
        <div className="SectionNav">
          <a href="/Conversations" className="LinkNav">
            {NavItem3}
          </a>
        </div>

        <div className="SectionNavName" >
          <a href="/" className="LinkNav nameNav">
            {user?.displayName}
          </a>
        </div>

        <div className="_ProfileSectionChat" onClick={toggleDropdown}>
          {/* <span className="ProfileIcon"><a href="/account" className="ProfileLink"> */}
          <img
            src={user?.photoURL}
            alt="user avator"
            className='image'
          />
          {isDropdownOpen && (
            <div className="_DropdownMenuNav">
              <button className="_buttonChat" onClick={handleSignOut}>
                Logout
              </button>

              <button className="_buttonChat" onClick={handleSettings}>
                Settings
              </button>
            </div>
          )}

        </div>
      </div>
      <svg
        className="SvgNav"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 200"
      >
        {" "}
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsla(259, 48%, 28%, 1)" />
          <stop offset="100%" stopColor="hsla(325, 75%, 44%, 1)" />
        </linearGradient>
        <g>
          <path
            fill="url(#gradient)"
            d="M0,128L80,128C160,128,320,128,480,117.3C640,107,800,85,960,90.7C1120,96,1280,128,1360,144L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </g>
      </svg>

    </>

  );
};

export default Navbar;
