import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBslF9CtuVAeCM5M7XP4IEsSz6lKDX0wAc",
  authDomain: "testapp-6d0bd.firebaseapp.com",
  projectId: "testapp-6d0bd",
  storageBucket: "testapp-6d0bd.firebasestorage.app",
  messagingSenderId: "35685273863",
  appId: "1:35685273863:web:0de9bac4e0c98d347ab5a2",
  measurementId: "G-YS5N11S25Y",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app)
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth, RecaptchaVerifier, signInWithPhoneNumber };