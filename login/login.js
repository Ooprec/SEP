import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where, getCountFromServer} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
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
  const auth = getAuth(app);

  //function runs on log in button, requires past created account
export function login(email, password){
    //call signInWithEmailAndPassword, sends email and password to firebase
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
       
      //email is sent to server for user in upload
        sessionStorage.setItem('userEmail', userCredential.user.email);
    //redirects the user to main landing page
        location.replace("./instructions.html");
    console.log("eh")
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
};

//creates new account, runs on sign up
export function signup(email, password){
    console.log("don dieu");
    console.log(email);
    console.log(password);
//requires REAL email aswell as 6 character password
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    console.log("don dieuu");
    const user = userCredential.user;
    sessionStorage.setItem('userEmail', userCredential.user.email);
    //redirects the user to main landing page
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}
