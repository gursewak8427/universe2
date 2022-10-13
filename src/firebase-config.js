import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBI0Vl7UAa0d8nCOoesJDquTvVMRkldEvg",
    authDomain: "tasalli-ea17f.firebaseapp.com",
    projectId: "tasalli-ea17f",
    storageBucket: "tasalli-ea17f.appspot.com",
    messagingSenderId: "166001245021",
    appId: "1:166001245021:web:6a9170f6cacb94960e86b4",
    measurementId: "G-G35858NVEM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { app, auth }