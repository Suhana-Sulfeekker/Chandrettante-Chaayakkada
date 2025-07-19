// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOCPvKYHcczKMaEAZEO7cSxg0comnbj90",
  authDomain: "chandrettante-chayakkada.firebaseapp.com",
  projectId: "chandrettante-chayakkada",
  storageBucket: "chandrettante-chayakkada.appspot.com",
  messagingSenderId: "456563926208",
  appId: "1:456563926208:web:25c47348e066752009f925"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
