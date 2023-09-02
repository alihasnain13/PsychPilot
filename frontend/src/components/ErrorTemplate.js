import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const ErrorTemplate = ({ prop }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Close the modal after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const onClose = () => {
    setIsVisible(false);
  };

  return (
    <div>
      {isVisible && (
        <Modal
          isOpen={true}
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
              maxWidth: '80%',
              maxHeight: '80%',
              overflow: 'hidden',
              margin: 'auto',
              padding: '20px',
              borderRadius: '8px',
              outline: 'none',
            },
          }}
        >
          <h1>{prop}</h1>
        </Modal>
      )}
    </div>
  );
};

export default ErrorTemplate;
