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

    try{  sessionStorage.removeItem("shelby");
        sessionStorage.removeItem("holder");
        sessionStorage.removeItem("allVotes");
      }
      catch {console.log("failed")}


    //Creates a list of objects, linking each voters decision to an object (voter)
    var allVotes = [];
    databaseItems.forEach((item) =>{
        allVotes.push({ first: item.data().first, second: item.data().second, third: item.data().third });
        
    });

    sessionStorage.setItem('allVotes', JSON.stringify(allVotes));
    vote(allVotes);

}

// //returns a list of only top choice votes
// export function isolate(allVotes){
//     for (var i in allVotes){
//       if(runner.includes(allVotes.first[i])){
//           runner.push(allVotes.first[i])
//       }

// }
// }

// //returns a list of only top choice votes
// export function cleanVotesForCounting(allVotes){

// }

// //returns a list of votes to count with eliminated candidate removed
//  export function removeLoser(allVotes, candidateToRemove){


// }

//returns a dictionary with candidate names as keys and vote tallies as values
//@param allVotes {list} - list of all of the votes to count

export async function vote(allVotes) {
    // var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); 
    

    // for (var voter in allVotes){
    // }
   
    var candidates = [];
    var votes = [];

    for (var i=0; i<allVotes.length; i++){
        if(!candidates.includes(allVotes[i].first)){
            candidates.push(allVotes[i].first);
            votes.push(0);
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

        //moves code back to session to be used for graphs
        sessionStorage.setItem('shelby', JSON.stringify(votes));
        sessionStorage.setItem('holder', JSON.stringify(candidates));
        
        return (votes);
       
        
}

document.getElementById("thingy").addEventListener("click", count);

export async function count() {
    //a list of total first choice votes for each candidate. ex) [14, 17, 6, 20]
    var votes = JSON.parse(sessionStorage.getItem('shelby')); //list of #
    //a list of all of the unique candidates (index corresponds to their votes in votes list)
    var candidates = JSON.parse(sessionStorage.getItem('holder')); // list of names
    //a list of "voter objects" with their three choices as attributes
    var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); // all voters

    let tempCovington = countCovington();
    let tempAll = allVotes;


    
    //the number needed to "win" the election
    var threshold = allVotes.length /2;

    //go through all the candidates
    // for(var i in candidates){
    //     if(votes[i] > threshold ){
    //         console.log(candidates[i] + " has won the election with " + votes[i] + " votes")
    //         return;
    //     }
    // }

    var firstMin = Math.min(...votes)
    console.log('');
    console.log(candidates.length)
    console.log(allVotes)

    // REWRITE THIS LATER

    // gets candidate and removes it from the list of candidates
    for (var j in candidates)
    {
        if (votes[j] == firstMin)
        {
            var removedCandiadate = candidates[j];
            candidates.splice(j,1);
            break;
        }
    }


    // go through each voter and, if any of their choices are not in the candidates list, change that

    for (var i in allVotes)
    {
        let voter = allVotes[i];
        if (!testVote(candidates, voter.third))
        {
            voter.third = null;
        }
        if (!testVote(candidates, voter.second))
        {
            voter.second = voter.third;
            voter.third = null;
        }
        if (!testVote(candidates, voter.first))
        {
            voter.first = voter.second;
            voter.second = voter.third;
            voter.third = null;
        }
        if (!testVote(candidates, voter.first) && !testVote(candidates, voter.second) && !testVote(candidates, voter.third) )
        {
            allVotes.splice(i,1);
        }
        
    }

    sessionStorage.setItem('allVotes',JSON.stringify(allVotes));
    //         sessionStorage.setItem('holder',JSON.stringify(candidates));


    // for(var j in candidates){
    //     if(votes[j] == firstMin){
    //         //candidates[j] is the person with the lowest number of votes
    //         for(var k in allVotes){
    //             if( candidates[j] == allVotes[k].first){
    //                 //set their first choice equal to their second)
    //                 if (candidates.includes(allVotes[k].second))
    //                 {
    //                     allVotes[k].first = allVotes[k].second;
    //                     allVotes[k].second = allVotes[k].third;
    //                     allVotes[k].third = null;
    //                 }
                    
    //                 else if (candidates.includes(allVotes[k].third)) {
    //                     allVotes[k].first = allVotes[k].third;
    //                     allVotes[k].second = null;
    //                     allVotes[k].third = null;
    //                 }
    //                 else {
    //                     allVotes.splice(k,1);
    //                 }
    //             }
    //             if (candidates[j] == allVotes[k].second)
    //             {
    //                 if (candidates.includes(allVotes[k].third))
    //                 {
    //                     allVotes[k].second = allVotes[k].third;
    //                     allVotes[k].third = null;
    //                 }
    //                 else
    //                 {
    //                     allVotes[k].second = null;
    //                     allVotes[k].third = null;
    //                 }
    //             }
    //             if (candidates[j] == allVotes[k].third)
    //             {
    //                 allVotes[k].third = null;
    //             }
    //             if (!candidates.includes(allVotes[k].first) && !candidates.includes(allVotes[k].second) && !candidates.includes(allVotes[k].third))
    //                 {
    //                     allVotes.splice(k,1)
    //                 }
                
    //         }
    //         candidates.splice(j,1);
    //         sessionStorage.setItem('allVotes',JSON.stringify(allVotes));
    //         sessionStorage.setItem('holder',JSON.stringify(candidates));
    //     }
        
    // }

    vote(allVotes);

    // let tempCovington2 = countCovington()
    // if (tempCovington2 == [3,0,0])
    // {
    //     console.log(tempAll);
    // }
    
    }


document.getElementById("thingo").addEventListener("click", countCovington);


function countCovington()
{
    let first = 0;
    let second = 0;
    let third = 0;
    let allVotes = JSON.parse(sessionStorage.getItem("allVotes"));
    for (i in allVotes)
    {
        if (allVotes[i].first == "Covington Adams III")
        {
            first++;
        }
        if (allVotes[i].second == "Covington Adams III")
        {
            second++;
        }
        if (allVotes[i].third == "Covington Adams III")
        {
            third++;
        }
    }
    if (first == 3)
    {
        console.log(allVotes);
    }
    // console.log(first + " | " + second + " | " + third);
    return [first,second,third];
}

function testVote(candidates, vote)
{
    return candidates.includes(vote);
}