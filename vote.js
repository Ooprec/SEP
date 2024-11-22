//henry

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


export async function loadFromDatabase () {
    const cname = document.getElementById("csv-options").value;
    const databaseItems = await getDocs(collection(db, cname));

    //Creates a list of objects, linking each voters decision to an object (voter)
    var allVotes = [];
    databaseItems.forEach((item) =>{
        allVotes.push({ first: item.data().first, second: item.data().second, third: item.data().third });
        
    });

    sessionStorage.setItem('allVotes', JSON.stringify(allVotes));
  

}

export async function vote(allVotes) {
    // console.log("function ran");
    // var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); 
    

    // for (var voter in allVotes){
    //     console.log(allVotes[voter].first);
    // }
    // console.log(allVotes.length)
   
    var candidates = [];
    var votes = [];

    //makes list of all candidates and their votes
    for (var i=0; i<allVotes.length; i++){
        // console.log(allVotes[i].first);
        if(!candidates.includes(allVotes[i].first)){
            // console.log(allVotes[i])
            candidates.push(allVotes[i].first);
            votes.push(0);
            // console.log(candidates);
        }
    }

     // tallies first round votes
     for(var i in allVotes){
        for(var j in candidates){
            if(allVotes[i].first == candidates[j]){
            votes[j] = votes[j] + 1;
         }
        }
        }

        // console.log(allVotes.length)
        // console.log(votes);
        //moves code back to session to be used for graphs
        sessionStorage.setItem('shelby', JSON.stringify(votes));
        sessionStorage.setItem('holder', JSON.stringify(candidates));
        
        return(votes);
       
        
}


export async function count() {
    //a list of total first choice votes for each candidate. ex) [14, 17, 6, 20]
    var votes = JSON.parse(sessionStorage.getItem('shelby')); 
    //a list of all of the unique candidates (index corresponds to their votes in votes list)
    var candidates = JSON.parse(sessionStorage.getItem('holder')); 
    //a list of "voter objects" with their three choices as attributes
    var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); 

    
    //the number needed to "win" the election
    var threshold = allVotes.length /2;
    console.log(threshold)

    //go through all the candidates
    for(var i in candidates){
        if(votes[i] > threshold ){
            console.log(candidates[i] + "has won the election");
            return;
        }
    }
    var firstMin = Math.min(votes)
    for(var j in candidates){
        if(votes[j]== firstMin){
            //candidates[j] is the person with the lowest number of votes
            for(var k in allVotes){
                if(candidates[j] == allVotes[k].first){
                    //set their first choice equal to their second
                    allVotes[k].first = allVotes[k].second
                }
            }
            break;
        }

        
    }

    vote(allVotes);
    var results = [];
    for(var i in votes){
        results.push(candidates[i] + ": " + votes[i]);
    }
            console.log(results)


}
    
