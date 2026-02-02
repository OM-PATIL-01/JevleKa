// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVi398UH7CggZnny4SvtmjvFzrS23q1kc",
    authDomain: "jevle-ka.firebaseapp.com",
    projectId: "jevle-ka",
    storageBucket: "jevle-ka.firebasestorage.app",
    messagingSenderId: "469088428171",
    appId: "1:469088428171:web:7e1cfabfc6459714ff348e",
    measurementId: "G-JLRT77XB11"
};

// Initialize Firebase using CDN (required for vanilla JS in browser)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };