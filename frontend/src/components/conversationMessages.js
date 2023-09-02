import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserAuth } from "../context/AuthContext";
import Modal from 'react-modal';
import '../styles/messagesContainer.css';
import ErrorTemplate from './ErrorTemplate';
import Loading from './loading';

const Conversation = ({ selectedSession, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [nomessages, setNoMessages] = useState(false);
  const { user } = UserAuth();

  const chathistory = () => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true);
        user.getIdToken(true)
          .then(async (idToken) => {
            let response = await axios.post(
              `http://localhost:3001/api/chathistory/details`,
              {
                userID: user.uid,
                conversationID: selectedSession,
              },
              {
                headers: {
                  Authorization: "Bearer " + idToken,
                },
              }
            );


            const { botMessages, userMessages } = response.data;
            const interleavedMessages = interleaveMessages(botMessages, userMessages);
            interleavedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            if (interleavedMessages.length === 0) {
              setNoMessages(true);
              setIsLoading(false);
            } else {
              setMessages(interleavedMessages);
              setNoMessages(false);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.log("Error fetching ID Token:", error.message);
            setNoMessages(true);
            setIsLoading(false);
            //reject(error);
          });
      } catch (error) {
        console.log("Error fetching messages:", error);
        setNoMessages(true);
        setIsLoading(false);
        //reject(error);
      }
    });
  };

  const handleCloseModal = () => {
    onClose();
  };

  useEffect(() => {
    if (selectedSession) {
      chathistory();
    }
  }, [selectedSession]);

  const interleaveMessages = (botMessages, userMessages) => {
    const interleaved = [];
    const totalMessages = Math.max(botMessages.length, userMessages.length);

    for (let i = 0; i < totalMessages; i++) {
      if (userMessages[i]) {
        interleaved.push({ content: userMessages[i], timestamp: new Date(), sender: "User" });
      }
      if (botMessages[i]) {
        interleaved.push({ content: botMessages[i].chatbotReply, timestamp: new Date(), sender: "bot" });
      }
    }

    return interleaved;
  };

  const renderMessage = (message, index) => {
    const isBotMessage = message.sender === 'bot';

    const messageContainerClassName = isBotMessage
      ? 'message-container bot-message'
      : 'message-container user-message';

    const messageContentClassName = isBotMessage
      ? 'message-content bot-content'
      : 'message-content user-content';

    return (
      <div key={index} className={messageContainerClassName}>
        <p className={messageContentClassName}>{message.content}</p>
        <small>{new Date(message.timestamp).toLocaleString()}</small>
      </div>
    );
  };

  if (isloading) {

    <Loading prop = {'Loadig'}/>

  } else {

      
    return (

      <>

        {
          nomessages ? (
            
              <ErrorTemplate prop={'No messages found in this conversation'} />
            

          ) : (

            <Modal
              isOpen={!!selectedSession}
              onRequestClose={onClose}
              contentLabel="Conversation Modal"
              ariaHideApp={false}
              style={{
                overlay: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: '3',
                },
                content: {
                  position: 'static',
                  minWidth: '40%',
                  maxWidth: '80%',
                  maxHeight: '80%',
                  overflow: 'hidden',
                  margin: 'auto',
                  padding: '20px',
                  borderRadius: '8px',
                  outline: 'none',
                },
              }
              }
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button className='closeButton' onClick={handleCloseModal}>
                    +
                  </button>
                  <h1 className='headingchatbox'>Chat with Bot</h1>
                </div>
                <div>
                  <h2>Conversation</h2>
                  <div className='conversationBorder'>{messages.map((message, index) => renderMessage(message, index))}</div>
                </div>
              </div>

            </Modal >


          )}

      </>

    );

  


  }

};

export default Conversation;
