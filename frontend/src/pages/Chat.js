import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import "../styles/chat.css";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import Loading from "../components/loading";
import Navbar from "../components/Navbar";
//import { firestore } from "../firebase";
//import { doc, getDoc } from "firebase/firestore";

//import sendIcon from 'https://img.icons8.com/?size=512&id=AdrKKYXG06TU&format=png';

function ChatPage() {

  const { conversationId } = useParams();
  const { logOut, user } = UserAuth();
  const [loadingMsg, setLoadingMsg] = useState('');
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [placeholder, setPlaceHolder] = useState("Type a message...");
  const [chatLog, setChatLog] = useState(() => {
    const storedChatHistory = localStorage.getItem(user.uid);
    return storedChatHistory ? JSON.parse(storedChatHistory) : [];
  });
  // const [chatLog, setChatLog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionEnding, setSessionEnding] = useState(false);
  const chatContainerRef = useRef(null);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  ///// formatting the chat response inti heading and paragrahs

  const formatChatGptResponse = (response) => {

    const paragraphs = response
      .split("\n")
      .filter((para) => para.trim() !== ""); // Split into paragraphs

    // Process each paragraph
    return paragraphs.map((para, index) => {
      // Check if the paragraph starts with a '#' symbol to identify headings
      if (para.startsWith("#") && para.endsWith("#")) {
        const headingText = para.substring(1, para.length - 1); // Remove '#' symbols
        return (
          <p key={index}>
            <b>{headingText}</b>
          </p>
        );
      } else {
        // Regular paragraph
        return <p key={index}>{para}</p>;
      }
    });
  };

  


  // End session

  const endSession = () => {


    return new Promise(async (resolve, reject) => {
      try {

        user
          .getIdToken(true)
          .then(async (idToken) => {
            setLoadingMsg('Session is ending please wait...')
            setSessionEnding(true);

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
            setSessionEnding(false)
            navigate('/Conversations')

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



  const ReloadFtn = async () => {
    setLoadingMsg(' ')
    setSessionEnding(true);

    if (Object.keys(user).length === 0) {


      console.log("No user found");


    }
    else {
      return new Promise(async (resolve, reject) => {
        try {
          

          console.log("Issue here")

          // Get the user's Firebase ID token
          user
            .getIdToken(true)
            .then(async (idToken) => {


              //Make a POST request to your API to get the AI's response
              const response = (await axios.post(
                "http://localhost:3001/api/chatbot/reload",
                {
                  userID: user.uid,
                  conversationID: conversationId,
                },
                {
                  headers: {
                    Authorization: "Bearer " + idToken,
                  },
                }
              ));

              

              if (Object.keys(response.data).length === 0) {

                console.log("response: ",response.data);
                document.querySelector('.bg-modalchat').style.display = "flex";
                setSessionEnding(false);
              } else {

                console.log(response.data)
               // setChatLog(response.data);

          
                response.data.forEach((object, index) => {

                  console.log(object);
                  

                  if(object.sender==='bot'){

                  const mes = {sender:'ai', message: object.message.chatbotReply} 
                  setChatLog(prevChatLog => [...prevChatLog, mes]);
                  }
                  else{
                    setChatLog(prevChatLog => [...prevChatLog, object]);
                  }
                 
                  
                  
                });
                setSessionEnding(false);

                //setChatLog(prevChatLog => [...prevChatLog, ...response.data]);
              }
            })
            .catch((error) => {
              console.log("Error");
              console.log("Error fetching ID Token:", error);
              reject(error); // Reject the Promise if there's an error
            });
        } catch (error) {
          console.log("Error fetching AI response:", error);
          reject(error); // Reject the Promise if there's an error
        }
      });
    }
  };



  const sendMessage = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Add user's message to the chat log
        setPlaceHolder("PsychPilot is typing ... ");
        const userMessage = { sender: "user", message: userInput };
        setChatLog((prevChatLog) => [...prevChatLog, userMessage]);
        setUserInput("");
        setIsLoading(true);

        // Get the user's Firebase ID token
        user
          .getIdToken(true)
          .then(async (idToken) => {
            console.log("ID Token:", idToken);

            //Make a POST request to your API to get the AI's response
            const response = (await axios.post(
              "http://localhost:3001/api/chatbot",
              {
                userInput: userInput,
                conversationID: conversationId,
                userName:user.displayName,

              },
              {
                headers: {
                  Authorization: "Bearer " + idToken,
                },
              }
            ));

            let aiReply = response.data.reply; // Log the AI's response
            
            aiReply = aiReply.chatbotReply;
            

            // Add AI's reply to the chat log
            const aiMessage = { sender: "ai", message: aiReply };
            setChatLog((prevChatLog) => [...prevChatLog, aiMessage]);

            setIsLoading(false);
            setPlaceHolder("Type a message...");

            resolve(aiReply); // Resolve the Promise with AI's reply
          })
          .catch((error) => {
            console.log("Error fetching ID Token:", error);
            setIsLoading(false);
            setPlaceHolder("Type a message...");
            reject(error); // Reject the Promise if there's an error
          });
      } catch (error) {
        console.log("Error fetching AI response:", error);
        reject(error); // Reject the Promise if there's an error
      }
    });
  };


  useEffect(() => {

    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

  }, [chatLog]);

  useEffect(() => {

    ReloadFtn();

  }, [user]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    // const { logOut, user } = UserAuth();

    try {
      // localStorage.removeItem(user.uid);
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const closeflex = () => {
    document.querySelector('.bg-modalchat').style.display = "none";
  };

  const handleSettings = () => {
    // Handle settings logic here
  };





  return (
    <>
      {sessionEnding && (
        <Loading prop={loadingMsg} />
      )}



      <div className="ChatPage">

        <Navbar NavItem1={"Home"} NavItem2={"Conversation"} NavItem3={"End Session"} />

        <div className="bg-modalchat">
          <div className="modal-contentschat">
            <button className="close" onClick={closeflex}>+</button>
            <div className="contententBoxchat">

              <h1> <b>👋 Welcome to our Secure Chatbot!</b></h1>
              <p>Feel free to share anything on your mind
                our chatbot is here to listen and provide<br />
                helpful responses. Whether you have questions,
                need assistance, or just want to chat, we're here for you.</p>
            </div>
          </div>
        </div>



        <div className="ChatContainer">
          <div className="Chat">

            {/* If needs a loading Gif


            <div className="us">
              {isLoading && (
                <div className="Section">
                  <img
                    src="https://retail.curator.interworks.com/plugins/interworks/tableauviz/assets/images/dots-loading-animation.gif"
                    style={{ width: "50px", height: "30px", marginLeft: "0px" }}
                    alt="Please wait your message is loadnig..."
                  />
                </div>
              )}

            </div> */}

            <div className="Messages" ref={chatContainerRef}>
              {chatLog.map((chat, index) => (
                <div
                  key={index}
                  className={`Message ${chat.sender === "user" ? "UserMessage" : "BotMessage"
                    }`}
                >
                  {chat.sender === "user" ? (
                    // If the sender is bot, display div1 on the right
                    <div className="msg">
                      <div className="MessageContent user ">{chat.message}</div>
                      <div className="ProfileIcon">
                        <img
                          src={user?.photoURL}
                          alt="user avator"
                          style={{ width: "20px" }}
                        />
                      </div>
                    </div>
                  ) : (
                    // If the sender is user, display div1 on the left
                    <div className="BotMessage">
                      <div className="ProfileIcon">
                        <img
                          src="https://th.bing.com/th/id/OIP.1-GkpyXtCOEcd_Wi9Y7QzAHaGH?pid=ImgDet&rs=1"
                          alt="user avator"
                          style={{ width: "20px" }}
                        />
                      </div>
                      <div className="MessageContent">
                        {formatChatGptResponse(chat.message)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bocContainer">


          <div className="ChatBoxInput">
            <input
              type="text"
              value={userInput}
              onChange={handleUserInput}
              onKeyPress={handleKeyPress}
              placeholder={placeholder} // Add the onKeyPress event handler
              styles={{ borderRadius: "20px" }}
              disabled={isLoading}
            />
            <button className="buttonSend" onClick={sendMessage}>
              <img
                className="SendIcon"
                src="https://img.icons8.com/?size=512&id=gaBzN6YXx4ki&format=png"
                alt="Send"
              />
            </button>
          </div>

          {/* <button className="endbutton" onClick={endSession}>End Session</button> */}
        </div>
      </div>
    </>
  );
}

export default ChatPage;