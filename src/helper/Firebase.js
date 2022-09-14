import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {    
    apiKey: "AIzaSyBtgUFslcLeQX2es842CQJL2pZ6O_qpl2k",
    authDomain: "spooky-a28d3.firebaseapp.com",
    databaseURL: "https://spooky-a28d3-default-rtdb.firebaseio.com",
    projectId: "spooky-a28d3",
    storageBucket: "spooky-a28d3.appspot.com",
    messagingSenderId: "104479335255",
    appId: "1:104479335255:web:d8a7f29c70f736ab34d412",
    measurementId: "G-N56EKG17KE"
};

const app = initializeApp(firebaseConfig);
const FireDB = getFirestore(app);
export const fbAUTH = getAuth(app);

export default FireDB;


