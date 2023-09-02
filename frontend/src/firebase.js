// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore"




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZesSS-Tqi9aSYAE2W_ZwEmffZZIOCpVs",
  authDomain: "therapy-chatbot-e046b.firebaseapp.com",
  projectId: "therapy-chatbot-e046b",
  storageBucket: "therapy-chatbot-e046b.appspot.com",
  messagingSenderId: "903905644322",
  appId: "1:903905644322:web:bf49b54ae9daf1e80c9f7b",
  measurementId: "G-CF1PVXC409"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export {firestore, auth}

