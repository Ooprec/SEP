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
  
  // console.log(docSnap.data().docsArray);
}
   //makes it so you can add csv data to a database
   //shoutout carson noble for this code
export async function importCSVToDatabase () {
    // const studentPieces = await getDocs(collection(db, "rank-choice-voting"));
    //   studentPieces.forEach((piece) =>{
    //     deleteDoc(doc(db, "rank-choice-voting", piece.id));
    //   } );

      try{
            var uname = document.getElementById("csv-name").value;
            if (uname.length < 8) {
              alert("Make sure the election name is at least eight characters long");
              return;
            }
            
            if (uname in getCollectionList()) {alert("Election name already taken"); return}

            const listRef = doc(db, "rank-choice-voting", "docList");
            await updateDoc(listRef, {
              docsArray: arrayUnion(uname)
            })

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
    catch (e) {
        console.error("Error adding votes to database: ", e);
        
    }

}