// Cooper's testing

// import firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// import functions from other scripts
import * as votejs from "./vote.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7vWOt5aS-mmTeGzKwgvcbMrx9K9KxATQ",
    authDomain: "rank-choice-voting-393ff.firebaseapp.com",
    projectId: "rank-choice-voting-393ff",
    storageBucket: "rank-choice-voting-393ff.appspot.com",
    messagingSenderId: "1070768963220",
    appId: "1:1070768963220:web:0c5e5968fa52688458fe81"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// function that checks through local storage and sees what needs to be pulled from the database
export async function checkLocal() {

    // check to see if allVotes exists:
    // if (sessionStorage.getItem("allVotes") == null)
    // {
    //     votejs.loadFromDatabase();
    // }

    // if (sessionStorage.getItem('shelby') == null)
    // {
    //     votejs.vote(JSON.parse(sessionStorage.getItem('allVotes')));
    // }

    // votejs.count();

}   


