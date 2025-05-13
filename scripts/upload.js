// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, addDoc, getDocs, arrayUnion, updateDoc, getDoc, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { Ubarhandler } from "./animations.js";


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

export async function getCollectionList()
{
  const listRef = doc(db, "rank-choice-voting", "docList");
  const docSnap = await getDoc(listRef);
  const docsArray = docSnap.data().docsArray;
  const select = document.getElementById("csv-options");

  select.innerHTML = '';

  for (let i = 0; i<docsArray.length; i++) {
    //grab username from login (email)
    let userEmail = localStorage.getItem("userEmail");
    //takes username from username document added through upload
    const creatorRef = doc(db, docsArray[i], "username");
    const creator = await getDoc(creatorRef);
    //only add to dropdown if it is created by user
    
    try {
      
        var check = (creator.data().username == userEmail);
        if (userEmail == "cooperstancil@gmail.com") {check = true;}
      
      
      if(check){
        let tempElement = document.createElement('option');
        tempElement.innerHTML = docsArray[i];
        select.appendChild(tempElement);
      }
    }
    catch (e) {
      console.log("Error getting creator data: ", e);
    }
  }

  return docsArray;
}

export const destroyVotes = async function(){
  const election = document.getElementById("csv-options").value;
  const select = document.getElementById("csv-options");
  const options = select.getElementsByTagName('option');
  select.dispatchEvent(new Event('change'));
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === election) {
      select.removeChild(options[i]);
      break;
    }
  }
  select.dispatchEvent(new Event('change'));
  const allDocumentsInCollection = await getDocs(collection(db, election));
  allDocumentsInCollection.forEach(item => {
    deleteDoc(doc(db, election, item.id));
  });
  const listRef = doc(db, "rank-choice-voting", "docList");
  const docSnap = await getDoc(listRef);


  let updatedArray = docSnap.data().docsArray;
  let index = updatedArray.indexOf(election);
  updatedArray.splice(index, 1);
  console.log(docSnap.data().docsArray + "___" + updatedArray);

  await updateDoc(listRef, {
    docsArray: updatedArray
  });
  
}