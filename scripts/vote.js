//henry

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

    if (sessionStorage.getItem(cname + "-archived")) {
        let archive = JSON.parse(sessionStorage.getItem(cname + "-archived"));
        sessionStorage.setItem('allVotes', JSON.stringify(archive.allVotes));
        sessionStorage.setItem('shelby', JSON.stringify(archive.shelby));
        sessionStorage.setItem('holder', JSON.stringify(archive.candidates));
        let allVotes = sessionStorage.getItem('allVotes');
        console.log("used archived data");
        vote(allVotes);
        return;
    }
    else {
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

    

    let candidates = []
    let votes = [];

    for (var i=0; i<allVotes.length; i++){
        if(!candidates.includes(allVotes[i].first)){
            candidates.push(allVotes[i].first);
            votes.push(0);
        }
    }

    sessionStorage.setItem('allVotes', JSON.stringify(allVotes));
    sessionStorage.setItem('shelby', JSON.stringify(votes));
    sessionStorage.setItem('holder', JSON.stringify(candidates));

    let archive = {
        allVotes: allVotes,
        shelby: votes,
        candidates: candidates
    }

    sessionStorage.setItem(cname + "-archived", JSON.stringify(archive));

    vote(allVotes);
    }
    

}

export async function vote(allVotes) {

    let second = JSON.parse(sessionStorage.getItem('on-second'));
    

    if (second) {
        var candidates = JSON.parse(sessionStorage.getItem('holder-second'));
    }
    else {
        var candidates = JSON.parse(sessionStorage.getItem('holder'));
    }
    

    let votes = []

    for (i in candidates)
    {
        votes.push(0);
    }

    // tallies first round votes
    for(var i in allVotes){
        votes[candidates.indexOf(allVotes[i].first)]++;
    }   

    //moves code back to session to be used for graphs
    if (!second) {
        sessionStorage.setItem('shelby', JSON.stringify(votes));
        sessionStorage.setItem('holder', JSON.stringify(candidates));
    }
    else {
        sessionStorage.setItem('shelby-second', JSON.stringify(votes));
        sessionStorage.setItem('holder-second', JSON.stringify(candidates));
    }
    
        
    return (votes);
        
}

export async function count() {
    let second = JSON.parse(sessionStorage.getItem('on-second'));
    if (second) {
        //a list of total first choice votes for each candidate. ex) [14, 17, 6, 20]
        var votes = JSON.parse(sessionStorage.getItem('shelby-second')); //list of #
        //a list of all of the unique candidates (index corresponds to their votes in votes list)
        var candidates = JSON.parse(sessionStorage.getItem('holder-second')); // list of names
        //a list of "voter objects" with their three choices as attributes
        var allVotes = JSON.parse(sessionStorage.getItem('allVotes-second')); // all voters

    }
    else {
        //a list of total first choice votes for each candidate. ex) [14, 17, 6, 20]
        var votes = JSON.parse(sessionStorage.getItem('shelby')); //list of #
        //a list of all of the unique candidates (index corresponds to their votes in votes list)
        var candidates = JSON.parse(sessionStorage.getItem('holder')); // list of names
        //a list of "voter objects" with their three choices as attributes
        var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); // all voters
    }


    
    //the number needed to "win" the election
    var threshold = allVotes.length /2;

    //go through all the candidates
    for(var i in candidates){
        if(votes[i] > threshold ){
            // console.log(candidates[i] + " has won the election with " + votes[i] + " votes")
            sessionStorage.setItem("winner", JSON.stringify(candidates[i]));
            return;
        }
    }

    var firstMin = Math.min(...votes)
   

    // REWRITE THIS LATER

    // gets candidate and removes it from the list of candidates
    for (var j in candidates)
    {
        if (votes[j] == firstMin)
        {
            var removedCandiadate = candidates[j];
            candidates.splice(j,1);
            votes.splice(j,1);
            break;
        }
    }


    

    // go through each voter and, if any of their choices are not in the candidates list, change that

    for (var i in allVotes)
    {
        
        let voter = allVotes[i];
        // check and see if the voters third vote is still an option

        if (!testVote(candidates, voter.third))
        {
            voter.third = null;
        }
        // check and see if the voters second vote is still an option, if not, bump
        if (!testVote(candidates, voter.second))
        {
            voter.second = voter.third;
            voter.third = null;
        }
        // check and see if the voters first vote is still an option, if not, bumnp
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

    //return to storage

    if (!second) {
        sessionStorage.setItem('allVotes',JSON.stringify(allVotes));
        sessionStorage.setItem('holder',JSON.stringify(candidates));
        sessionStorage.setItem('shelby', JSON.stringify(votes));
        vote(allVotes);
    }
    else {
        sessionStorage.setItem('allVotes-second',JSON.stringify(allVotes));
        sessionStorage.setItem('holder-second',JSON.stringify(candidates));
        sessionStorage.setItem('shelby-second', JSON.stringify(votes));
        vote(allVotes);
    }

    
    
    }


//test
function testVote(candidates, vote)
{
    return candidates.includes(vote);
}

export function removeWinner()
{
    var winner = JSON.parse(sessionStorage.getItem("winner"));
    var electionName = document.getElementById("csv-options").value;
    var archivedElection = JSON.parse(sessionStorage.getItem(electionName + "-archived"));

    var candidates = archivedElection.candidates;
    var votes = archivedElection.shelby;
    var allVotes = archivedElection.allVotes;

    var winnerIndex = candidates.indexOf(winner);
    candidates.splice(winnerIndex, 1);
    votes.splice(winnerIndex, 1);

    for (var i in allVotes)
    {
        if (allVotes[i].first == winner)
        {
            allVotes[i].first = allVotes[i].second;
            allVotes[i].second = allVotes[i].third;
            allVotes[i].third = null;
        }
        if (allVotes[i].second == winner)
        {
            allVotes[i].second = allVotes[i].third;
            allVotes[i].third = null;
        }
        if (allVotes[i].third == winner)
        {
            allVotes[i].third = null;
        }
        if (allVotes[i].first == null && allVotes[i].second == null && allVotes[i].third == null)
        {
            allVotes.splice(i, 1);
            i--;
        }
    }

    
    sessionStorage.setItem('on-second', JSON.stringify(true));

    sessionStorage.setItem('allVotes-second', JSON.stringify(allVotes));
    sessionStorage.setItem('shelby-second', JSON.stringify(votes));
    sessionStorage.setItem('holder-second', JSON.stringify(candidates));


    vote(allVotes);

    
}