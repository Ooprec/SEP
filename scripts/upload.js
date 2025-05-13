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
    
    // try {
    try {
      let check = (creator.data().username == userEmail);
      
      // catch {
      //   // var check = true;
      //   window.alert("You are not logged in. Please log in to view your elections.");
      //   location.replace("login.html");
      // }
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




// export async function importCSVToDatabase () {

//   console.log("importing")
//   try{   
//     var uname = document.getElementById("csv-name").value;
            
//     if (uname in getCollectionList()) {alert("Election name already taken"); return}
//     const listRef = doc(db, "rank-choice-voting", "docList");
//     const docSnap = await getDoc(listRef);
//     const docsArray = docSnap.data().docsArray;
    

//     var file = document.getElementById("csv").files[0];
//     var reader = new FileReader();
//     reader.onload = async function(event) {
      
//       var csvData = event.target.result;
//       //seperates the csv data into rows to seperate candidates
//       var rows = csvData.split("\n");
//       var len = rows.length;
//       //looping through all rows, fills rows
//       for (var i = 1; i < rows.length; i++) {
//         //cells is an array of cells
//         var cells = rows[i].split(",");   
//         //sets each vote casted by each person equal to a value
//         //represented in fire base as (e.g. First: "Name of Candidate")
//         Ubarhandler(len, i+1);
//             var docRef = await addDoc(collection(db, uname),  {data:[cells[2], cells[3], cells[4].substring(0, cells[4].length-1)]});
//             var userAdmin = localStorage.getItem('userEmail');            
      
//             //tests to make sure the code fires
//             console.log("Document written with ID: ", docRef.id); 
//             // console.log("Document written with ID: ", docRef.id);

//       }
//       //adds username doc to each election
//       await setDoc(doc(db, uname, "username"), {
//         username: userAdmin,
//       });
//     };
//     reader.readAsText(file);
//     file.innerHTML = null; 
//     let updatedDoc = docsArray;
//     updatedDoc.push(uname);

//     await updateDoc(listRef, {
//       docsArray: updatedDoc,
//     })
//   }
//   //catch commander to prevent system stoppage in the event of wrongly submitted info
//   catch (e) 
//   {
//     console.error("Error adding votes to database: ", e);   
//   }
//   // location.reload(); 

// }

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

// const submit = document.getElementById("submit");
// submit.addEventListener("click", async (e)=> {
//   console.log(e)
//   e.preventDefault();
//   await importCSVToDatabase();
//   getCollectionList();
  // location.reload();

// })