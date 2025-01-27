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

// //returns a list of only top choice votes
// export function isolate(allVotes){
//     for (var i in allVotes){
//       if(runner.includes(allVotes.first[i])){
//           runner.push(allVotes.first[i])
//       }

// }
// }
// console.log("le")
// console.log(runner)

// //returns a list of only top choice votes
// export function cleanVotesForCounting(allVotes){

// }

// //returns a list of votes to count with eliminated candidate removed
//  export function removeLoser(allVotes, candidateToRemove){


// }

//returns a dictionary with candidate names as keys and vote tallies as values
//@param allVotes {list} - list of all of the votes to count

export async function vote(allVotes) {
    // console.log("function ran");
    // var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); 
    

    // for (var voter in allVotes){
    //     console.log(allVotes[voter].first);
    // }
    // console.log(allVotes.length)
   
    var candidates = [];
    var votes = [];

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
        console.log("ohjitticus")
        console.log(votes);
        //moves code back to session to be used for graphs
        sessionStorage.setItem('shelby', JSON.stringify(votes));
        sessionStorage.setItem('holder', JSON.stringify(candidates));
        
        return (votes);
       
        
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
    var firstMin = Math.min(...votes)
    console.log(votes)
    console.log(firstMin);
    for(var j in candidates){
        if(votes[j]== firstMin){
            //candidates[j] is the person with the lowest number of votes
            for(var k in allVotes){
                // console.log("gro")
                if(candidates[j] == allVotes[k].first){
                    console.log(allVotes[k].first)
                    //set their first choice equal to their second
                    allVotes[k].first = allVotes[k].second
                    console.log(allVotes[k].first)
                    // console.log(allVotes[k].first)
                    // console.log(allVotes[k].second)

                }
            }
            break;
        }

        
    }
    // console.log(allVotes)
    vote(allVotes)
    console.log(allVotes);
    var results = [];
    for(var i in votes){
        console.log("merhaba")
        results.push(candidates[i] + ": " + votes[i]);
    }
            console.log("newicus")
            console.log(results)

            //FOR HENRY FUTURE: CODE DOESNT WORK BECAUSE THE LIST REVERTS UPON GOING THROUGH VOTE FUNCTION AGAIN
            //nah fr

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