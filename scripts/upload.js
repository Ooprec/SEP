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

var myElections = [];



export async function getCollectionList()
{
  var myElections = [];

  const listRef = doc(db, "rank-choice-voting", "docList");
  const docSnap = await getDoc(listRef);
  const docsArray = docSnap.data().docsArray;
  const select = document.getElementById("csv-options");
  let userEmail = sessionStorage.getItem("userEmail");


  for (let i = 0; i<docsArray.length; i++) {
    //grab username from login (email)
    //takes username from username document added through upload
    const creatorRef = doc(db, docsArray[i], "username");
    // console.log(docsArray[i]);
    const creator = await getDoc(creatorRef);
    //only add to dropdown if it is created by user
    

      try{
        var check = (creator.data().username == userEmail);
        // console.log("this is check" + check);
        // if (userEmail == "cooperstancil@gmail.com") {check = true;}
      // console.log(creator.data().username);
      // console.log(userEmail);
      
      if(check){
        // console.log("This belongs to: " + creator.data().username);
        let tempElement = document.createElement('option');
        tempElement.innerHTML = docsArray[i];
        select.appendChild(tempElement);
        myElections.push(docsArray[i]);
      }
    } catch {
      // console.log(docsArray[i] + " has no username");
    }
    
    }
    
    //checks if you no elecitons
    if(myElections.length == 0){
      // console.log("sigma");
      //makes a new html element to add to the dropdown
      const empty = document.createElement('option');
      //gives the html element a vlue and a text
      empty.value = 'no_elections';
      empty.text = 'You have no elections';
      //adds it to the dropdown
      select.appendChild(empty);
    }
    // console.log("ended getCollectionList function")
    return myElections;
  }






export const areYouSure = async function(){
  const election = document.getElementById("csv-options").value;

  if (election == 'no_elections'){
    return
  }

  //event listener running on the click
    // //can you delete?
    if(window.confirm("Are you sure you want to delete this election?")){
      destroyVotes();
      alert("Election deleted")
     
    }else{
      //if no
      alert("Election not deleted");
    }
  
  
  };



export async function destroyVotes(){
  
  const election = document.getElementById("csv-options").value;
  const select = document.getElementById("csv-options");
  const options = select.getElementsByTagName('option');
  select.dispatchEvent(new Event('change'));
  if (election == 'no_elections'){
    return
  }
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === election) {
      // console.log("rh");
      select.removeChild(options[i]);
      break;
    }
  }
  select.dispatchEvent(new Event('change'));
  const allDocumentsInCollection = await getDocs(collection(db, election));
  allDocumentsInCollection.forEach(item => {
    deleteDoc(doc(db, election, item.id));
    // console.log("herm");
  });
  const listRef = doc(db, "rank-choice-voting", "docList");
  const docSnap = await getDoc(listRef);


  let updatedArray = docSnap.data().docsArray;
  let index = updatedArray.indexOf(election);
  updatedArray.splice(index, 1);
  // console.log("check this " + docSnap.data().docsArray + "___" + updatedArray);

  await updateDoc(listRef, {
    docsArray: updatedArray
  });
  
}