import { UserAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/conversations.css";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import buttonLoading from "../components/buttonLoading";
import SessionList from "../components/sessionSelect";
import Conversation from "../components/conversationMessages";

function Conversations() {
  const Navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [buttoncliked, setButtonClicked] = useState(false);
  const { logOut, user } = UserAuth();

  // Function to handle session selection
  const handleSessionSelect = (sessionID) => {
    setSelectedSession(sessionID);
  };


  // const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    // const { logOut, user } = UserAuth();

    try {
      //localStorage.removeItem(user.uid);
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettings = () => {
    // Handle settings logic here
  };

  const closeflex = () => {
    document.querySelector(".bg-modal").style.display = "none";
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  const startsession = () => {
    setButtonClicked(true);
    return new Promise(async (resolve, reject) => {
      try {
        user
          .getIdToken(true)
          .then(async (idToken) => {
            console.log("token recieved: ", idToken);

            let response = await axios.post(
              "http://localhost:3001/api/chatbot/create",
              {}, // request body. Keep it empty if you have no data to send
              {
                headers: {
                  Authorization: "Bearer " + idToken,
                },
              }
            );

            let conversationId = response.data.conversationID;
            console.log(conversationId);
            setButtonClicked(false);
            Navigate(`/chat/${conversationId}`);
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

  return (
    <>

      <Navbar NavItem1={"Home"} NavItem2={"Conversation"} NavItem3={"Plan"} />

      <div className="ContentConvers">


        <div>

          <SessionList onSessionSelect={handleSessionSelect} />
          {selectedSession && <Conversation selectedSession={selectedSession} onClose={handleCloseModal} />}
        </div>

        <div className="newSessionButton">
          <div>
            <button className="buttonConvers">
              <Link className="Link " onClick={startsession}>
                {buttoncliked ? (
                  // Display the loading component (replace 'LoadingComponent' with your actual loading component)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={{
                      margin: 'auto',
                      background: 'none',
                      display: 'block',
                      shapeRendering: 'auto',
                    }}
                    width="44px"
                    height="44px"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                  >
                    <rect x="18.5" y="31" width="13" height="38" fill="#456caa">
                      <animate
                        attributeName="y"
                        repeatCount="indefinite"
                        dur="0.970873786407767s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="12;31;31"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                        begin="-0.1941747572815534s"
                      />
                      <animate
                        attributeName="height"
                        repeatCount="indefinite"
                        dur="0.970873786407767s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="76;38;38"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                        begin="-0.1941747572815534s"
                      />
                    </rect>
                    <rect x="43.5" y="31" width="13" height="38" fill="#88a2ce">
                      <animate
                        attributeName="y"
                        repeatCount="indefinite"
                        dur="0.970873786407767s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="16.75;31;31"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                        begin="-0.0970873786407767s"
                      />
                      <animate
                        attributeName="height"
                        repeatCount="indefinite"
                        dur="0.970873786407767s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="66.5;38;38"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                        begin="-0.0970873786407767s"
                      />
                    </rect>
                    <rect x="68.5" y="31" width="13" height="38" fill="#c2d2ee">
                      <animate
                        attributeName="y"
                        repeatCount="indefinite"
                        dur="0.970873786407767s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="16.75;31;31"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                      />
                      <animate
                        attributeName="height"
                        repeatCount="indefinite"
                        dur="0.970873786407767s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="66.5;38;38"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                      />
                    </rect>
                  </svg>
                ) : (
                  // Display the "Start New Session" text
                  <span>Start New Session</span>
                )}
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Conversations;
