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
    const databaseItems = await getDocs(collection(db, "rank-choice-voting"));

    //Creates a list of objects, linking each voters decision to an object (voter)
    var allVotes = [];
    databaseItems.forEach((item) =>{
        allVotes.push({ first: item.data().first, second: item.data().second, third: item.data().third });
        
    });

    sessionStorage.setItem('allVotes', JSON.stringify(allVotes));
  

}

export async function vote() {
    // console.log("function ran");
    var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); 
    

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
        sessionStorage.setItem('shelby', JSON.stringify(votes));
        return(votes);
        
}
//     console.log("candidates");
// console.log(candidates);



  
// src="https://cdn.jsdelivr.net/npm/chart.js"

// const ctx = document.getElementById('myChart');

// var l = 12
// function but(){
//     l++
// }

// new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//       label: '# of Votes',
//       data: [l, 19, 3, 5, 2, 3],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });