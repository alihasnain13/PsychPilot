import React, { useEffect } from 'react';
import { GoogleButton } from 'react-google-button';
import { FacebookLoginButton } from "react-social-login-buttons";
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/sign.css'
import { firestore } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import axios from 'axios';

const Signin = () => {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  /// this was the mannual way with out using Api 
  // const addUserToDatabase = (user) => {
  //   // Get a reference to the Firestore collection (replace 'users' with your desired collection name)
  //   //const usersCollection = firestore.collection('Users');
  //   const ref = doc(firestore,'Users',user.uid);

  //   // Use the user's UID as the document key for the user data
  //   setDoc(ref,{
  //       displayName: user.displayName,
  //       email: user.email,
  //       photoURL: user.photoURL,
  //       // Add other user-specific data as needed
  //       age: 25,
  //       role: 'user',
  //       // Add any other properties you want to store for the user
  //     })
  //     .then(() => {
  //       console.log('User added to Firestore successfully!');
  //     })
  //     .catch((error) => {
  //       console.error('Error adding user to Firestore:', error);
  //     });
  // };


  // this was the mannual way to check user with out calling APi
  // const checkUserExists = async (userId) => {
  //   try {
  //     // Get a reference to the Firestore document for the user with the specified userId
  //     const userRef = doc(firestore,'Users',userId);

  //     // Get the document snapshot using the get() method
  //     const snapshot = await userRef.get();

  //     // Check if the document exists (snapshot.exists)
  //     if (snapshot.exists) {
  //       return true; // User exists in the database
  //     } else {
  //       return false; // User does not exist in the database
  //     }
  //   } catch (error) {
  //     console.error('Error checking user existence:', error);
  //     return false; // Return false in case of any error
  //   }
  // };

  // const  userdoc = async(user)=>{

  //   const docRef = doc(firestore, "Users", user.uid);
  // const docSnap = await getDoc(docRef);

  // if (docSnap.exists()) {
  //   navigate('/account');
  // } else {
  //   // docSnap.data() will be undefined in this case
  //   navigate('/signin/introductory');
  // }
  //   }

  const handleCreateDocument = async (userId) => {
    try {
      const data = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'User',
        uid: userId,

      };

      const response = await axios.post('http://localhost:3001/api/createUserDocument', { userId, data });
        console.log(response.data.message);
    } catch (error) {
      console.error('Error creating document:', error);

    }
  };

  const handleAuthenticateUser = async (userId) => {
    try {
      const response = await axios.post('http://localhost:3001/api/authenticateUser', { userId });

      // If the request is successful, the user is authenticated
      if (response.data.message === 'User authenticated') {
        return true;
      } else {
        return false;
      }

    } catch (error) {
      // If the request fails, the user is not authenticated
      console.error('Error authenticating user:', error);

    }
  };


  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (user != null) {
      console.log(user);
      if (handleAuthenticateUser(user.uid)) {

        navigate('/account');

      } else {

        handleCreateDocument(user.uid);
        navigate('/signin/introductory');
      }


    }
  }, [user]);

  return (
    <div className='container'>
      <h1>Sign in</h1>
      <div>
        <GoogleButton className='__button' onClick={handleGoogleSignIn} />
        <FacebookLoginButton className='__button' onClick={() => alert("Hello")} />
      </div>

    </div>
  );
};

export default Signin;
