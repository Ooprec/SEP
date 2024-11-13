// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

export const addItem = function(item){
    try{
        console.log("greg")
      //docref is document reference
      const docRef = addDoc(collection(db,"henry-todos"),{
        name: item,
        isCompleted: false,
    
      });
    }
    catch(e){
    console.error("Error adding item to data base: ", e)
    }
    document.getElementById("newItem").value = "";
    }

   //makes it so you can add csv data to a database
   //shoutout carson noble for this code
export async function importCSVToDatabase () {
    // const studentPieces = await getDocs(collection(db, "rank-choice-voting"));
    //   studentPieces.forEach((piece) =>{
    //     deleteDoc(doc(db, "rank-choice-voting", piece.id));
    //   } );

      try{
        
            var file = document.getElementById("csv").files[0];
            var reader = new FileReader();
            reader.onload = function(event) {
              var csvData = event.target.result;
              //seperates the csv data into rows to seperate candidates
              var rows = csvData.split("\n");
              //looping through all rows, fills rows
              for (var i = 0; i < rows.length; i++) {
                //cells is an array of cells
                var cells = rows[i].split(",");
               
                //sets each vote casted by each person equal to a value
                //represented in fire base as (e.g. First: "Name of Candidate")
                try {
                    const docRef = addDoc(collection(db, "rank-choice-voting"), {
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