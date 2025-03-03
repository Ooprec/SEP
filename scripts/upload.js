// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, addDoc, getDocs, arrayUnion, updateDoc, getDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
    let tempElement = document.createElement('option');
    tempElement.innerHTML = docsArray[i];
    select.appendChild(tempElement);
  }

  return docsArray;
}

export async function importCSVToDatabase () {
  // const studentPieces = await getDocs(collection(db, "rank-choice-voting"));
  //   studentPieces.forEach((piece) =>{
  //     deleteDoc(doc(db, "rank-choice-voting", piece.id));
  //   } );
  console.log("importing")
  try{   
    var uname = document.getElementById("csv-name").value;
            
    if (uname in getCollectionList()) {alert("Election name already taken"); return}
    const listRef = doc(db, "rank-choice-voting", "docList");
    const docSnap = await getDoc(listRef);
    const docsArray = docSnap.data().docsArray;
    let updatedDoc = docsArray;
    updatedDoc.push(uname);

    await updateDoc(listRef, {
      docsArray: updatedDoc,
    })
    console.log("uname updates")
    var file = document.getElementById("csv").files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      var csvData = event.target.result;
      //seperates the csv data into rows to seperate candidates
      var rows = csvData.split("\n");
      //looping through all rows, fills rows
      for (var i = 1; i < rows.length; i++) {
        //cells is an array of cells
        var cells = rows[i].split(",");   
        //sets each vote casted by each person equal to a value
        //represented in fire base as (e.g. First: "Name of Candidate")
        try {
            const docRef = addDoc(collection(db, uname), {
              first: cells[2],
              second: cells[3],
              third: cells[4],      
            });
            //tests to make sure the code fires
            console.log("Document written with ID: ", docRef.id); 
            // console.log("Document written with ID: ", docRef.id);
        } 
                
        catch (e) {
          console.error("Error adding votes to database: ", e);     
        }  
      }
    };
    reader.readAsText(file);
    file.innerHTML = null; 
       
  }
  //catch commander to prevent system stoppage in the event of wrongly submitted info
  catch (e) 
  {
    console.error("Error adding votes to database: ", e);   
  }
  location.reload(); 

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

const submit = document.getElementById("submit");
submit.addEventListener("click", (e)=> {
  console.log(e)
  e.preventDefault();
  importCSVToDatabase();
  getCollectionList();


})