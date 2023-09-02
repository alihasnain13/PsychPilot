import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext';
import axios from 'axios';
//import { setDoc,doc,collection } from "@firebase/firestore"

const Introductory = () => {
  //  const location = useLocation();
  const navigate = useNavigate();
  const { user } = UserAuth();
  const userId = user.uid; // Retrieve the userId from the location state

  const [formData, setFormData] = useState({
    _1: '--',
    _2: '--',
    _3: '--',
    _4: '--',
    _5: '--',
    _6: '--',

    // Add more fields for other introductory questions as needed
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addUserToDatabase = (user) => {
    // Get a reference to the Firestore collection (replace 'users' with your desired collection name)
    //const usersCollection = firestore.collection('Users');
    const ref = doc(firestore, 'Users', user.uid);

    // Use the user's UID as the document key for the user data
    setDoc(ref, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      // Add other user-specific data as needed
      age: 25,
      role: 'user',
      // Add any other properties you want to store for the user
    })
      .then(() => {
        console.log('User added to Firestore successfully!');
      })
      .catch((error) => {
        console.error('Error adding user to Firestore:', error);
      });
  };


  //////////////////////////////////////////////// update document using 

  // Example using fetch API
// const updateDocument = async (documentId, data) => {
//   try {
//     const response = await fetch(`/api/updateDocument/${documentId}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       const result = await response.json();
//       console.log(result.message);
//     } else {
//       console.error('Failed to update document:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error updating document:', error);
//   }
// };


const handleUpdateData = async (documentId,updateData) => {
  try {
    const response = await axios.post(`http://localhost:3001/api/updateDocument/${documentId}`, { data: updateData });
      console.log(response.data+ "Data successfully updated");
  } catch (error) {
    console.error('Error updating data:', error);
  }
};


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Save the introductory data to Firestore
      // Save the introductory data to Firestore

      handleUpdateData(user.uid, formData);

//////////// below is the old method 
      //const ref = doc(firestore, 'Users', user.uid);

      // Use the user's UID as the document key for the user data
      // setDoc(ref, {
      //   useruid: user.uid,
      //   displayName: user.displayName,
      //   email: user.email,
      //   photoURL: user.photoURL,
      //   // Add other user-specific data as needed
      //   age: 25,
      //   role: 'user',
      //   Q_1: formData._1,
      //   Q_2: formData._2,
      //   Q_3: formData._3,
      //   Q_4: formData._4,
      //   Q_5: formData._5,
      //   Q_6: formData._6,
      //   // Add any other properties you want to store for the user
      // })
      //   .then(() => {
      //     console.log('User added to Firestore successfully!');
      //   })
      //   .catch((error) => {
      //     console.error('Error adding user to Firestore:', error);
      //   });
      // console.log('formData:', formData);


      navigate('/account');
    } catch (error) {
      console.error('Error saving introductory data:', error);
    }
  };

  return (
    <div className="container" style={{ backgroundColor: '#C31C7E' }}>
      <h1>Introductory Questionnaire</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid' }}>
        <label htmlFor="_1">What are your therapy goals?</label>
        <input
          type="text"
          id="_1"
          name="_1"
          value={formData.therapyGoals}
          onChange={handleChange}
          required

        />

        <label htmlFor="_2">What are your therapy goals?</label>
        <input
          type="text"
          id="_2"
          name="_2"
          value={formData.therapyGoals}
          onChange={handleChange}
          required
        />

        <label htmlFor="_3">What are your therapy goals?</label>
        <input
          type="text"
          id="_3"
          name="_3"
          value={formData.therapyGoals}
          onChange={handleChange}
          required
        />

        <label htmlFor="_4">What are your therapy goals?</label>
        <input
          type="text"
          id="_4"
          name="_4"
          value={formData.therapyGoals}
          onChange={handleChange}
          required
        />

        <label htmlFor="_5">What are your therapy goals?</label>
        <input
          type="text"
          id="_5"
          name="_5"
          value={formData.therapyGoals}
          onChange={handleChange}
          required
        />

        <label htmlFor="_6">What are your therapy goals?</label>
        <input
          type="text"
          id="_6"
          name="_6"
          value={formData.therapyGoals}
          onChange={handleChange}
          required
        />
        {/* Add more form fields for other introductory questions as needed */}
        <button style={{ backgroundColor: 'black', color: 'white' }} type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Introductory;
