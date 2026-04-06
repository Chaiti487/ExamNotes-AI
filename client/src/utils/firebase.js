

import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "examnotes-d5fcc.firebaseapp.com",
  projectId: "examnotes-d5fcc",
  storageBucket: "examnotes-d5fcc.firebasestorage.app",
  messagingSenderId: "1033049621622",
  appId: "1:1033049621622:web:eee3720853a83f15358b57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export { auth, provider }