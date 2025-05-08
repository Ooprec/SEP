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

export async function loadFromDatabase() {
    const cname = document.getElementById("csv-options").value;

    if (sessionStorage.getItem(cname + "-archived")) {
        let archive = JSON.parse(sessionStorage.getItem(cname + "-archived"));
        sessionStorage.setItem('allVotes', JSON.stringify(archive.allVotes));
        sessionStorage.setItem('shelby', JSON.stringify(archive.shelby));
        sessionStorage.setItem('holder', JSON.stringify(archive.candidates));
        return;
    }
    else {
        var databaseItems = await getDocs(collection(db, cname));
    
    //Creates a list of objects, linking each voters decision to an object (voter)
    var allVotes = []; 

    try {
        sessionStorage.removeItem("allVotes");
        sessionStorage.removeItem("shelby");
        sessionStorage.removeItem("holder");
    }
    catch {
        console.log("Error deleting session storage items.");
    }

    // Pull all the documents from the specified collection in Firebase
    for (const doc of databaseItems.docs) {
        // console.log(`Document ID: ${doc.id}, Data:`, doc.data());
    }

    for (const item of databaseItems.docs) {
        // console.log(item.data().data);
        if (item.id != "username" ){
            allVotes.push(item.data().data);
        }
    }

    let candidates = []
    let votes = [];

    // console.log(allVotes);

    for (var i=0; i<allVotes.length; i++) {
        if (!candidates.includes(allVotes[i][0])) 
        {
            candidates.push(allVotes[i][0]);
            votes.push(0);
        }   
    }

    console.log(`Candidates: ${candidates}`);
    console.log(`Votes: ${votes}`);
    

    // Remove duplicates from candidates
    // candidates = [...new Set(candidates)];

    let initVoteData = await initVote(allVotes);
    votes = initVoteData.votes;
    candidates = initVoteData.candidates;


    sessionStorage.setItem('allVotes', JSON.stringify(allVotes));
    sessionStorage.setItem('shelby', JSON.stringify(votes));
    sessionStorage.setItem('holder', JSON.stringify(candidates));

    let archive = {
        allVotes: [...allVotes],
        shelby: [...votes],
        candidates: [...candidates]
    }


    sessionStorage.setItem(cname + "-archived", JSON.stringify(archive));

    console.log("Loaded from database: " + cname);

    

    // vote(allVotes);
    }
}
// dunno why but this needs to be here for the page to work
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
        votes[candidates.indexOf(allVotes[i][0])]++;
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

export async function newCount(votes, candidates, allVotes) {
    //votes: a list of total first choice votes for each candidate. ex) [14, 17, 6, 20]
    //candidates: a list of all of the unique candidates (index corresponds to their votes in votes list)
    //allVotes: a list of voter lists with their three choices as elements in an array

    votes = [];

    for (let i in candidates) {
        votes.push(0);
    }

    // Tally up allVotes
    for (let i in allVotes) {
        let vote = allVotes[i][0];
        if (candidates.includes(vote)) {
            votes[candidates.indexOf(vote)]++;
        }
        else{
            // console.log("Vote: " + vote + " Candidate: " + candidates[candidates.indexOf(vote)]);
        }
    }

    let firstMin = Math.min(...votes)
    // check for the losing candidate and then remove them from the list of candidates and votes
    let count = 0;

    for (let i in votes)
    {
        if (votes[i] == firstMin) {count++};
    }   
    // if (count > 1)  {
    //     let candidateVotes = {};
    //     for (let i in candidates) {
    //         candidateVotes[candidates[i]] = votes[i];
    //     }
    // }


    if (firstMin == 0 && count == candidates.length) {
        console.error("All candidates have 0 votes. No one can be eliminated.");
        let e = {votes: [...votes],candidates: [...candidates],allVotes: [...allVotes],count: count,}
        console.log(e);
        }

    for (let runs = 0; runs < count; runs++) 
    {
        for (let i in candidates)
        {
            if (votes[i] == firstMin)
            {
                var removedCandidate = candidates[i];
                candidates.splice(i,1);
                votes.splice(i,1);
            }
        }
    }
    

    // remove votes for the removed candidate from the allVotes list and bump the other votes up
    for (let i in allVotes)
    {
        let voter = allVotes[i];
        if (voter.indexOf(removedCandidate)>=0)
        {
            voter.splice(voter.indexOf(removedCandidate),1);
            voter.push(null)
        }
        if (voter[0] == null && voter[1] == null && voter[2] == null)
        {
            allVotes.splice(i,1);
        }
    }

    let results = await newVote(allVotes, candidates);
    
    return {
        votes: [...results.votes],
        candidates: [...results.candidates],
        allVotes: [...allVotes],
        count: count,
    }
            
}

export async function newVote(allVotes, candidates) 
{

    let votes = [];

    candidates = correctCandidateNames(candidates);

    for (i in candidates)
    {
        votes.push(0);
    }

    // tallies first round votes
    for (var i in allVotes)
        {
        let vote = allVotes[i][0];
        for (var j in candidates)
        {
            if (vote == candidates[j])
            {
                votes[j]++;
            }
            else {
                // console.log("Vote: " + vote + " Candidate: " + candidates[j]);
            }
        }
        
        
    }   

    
    
    //moves code back to session to be used for graphs
    return {
        votes: [...votes], 
        candidates: [...candidates]
    };
}

export async function initVote(allVotes)
{
    let votes = [];
    let candidates = [];

    for (i in allVotes)
    {
        let voter = allVotes[i]
        for (let j in voter)
        {
           candidates.push(voter[j]);
        }
    }

    candidates = correctCandidateNames(candidates);

    candidates = [...new Set(candidates)];

    for (i in candidates)
    {
        votes.push(0);
    }

    for (var i in allVotes)
    {
        let vote = allVotes[i][0];
        votes[candidates.indexOf(vote)]++;
        
    }

    return {
        votes: [...votes],
        candidates: [...candidates]
    }
}



function correctCandidateNames(candidates) {
    let correctedCandidates = [...candidates];

    for (let i = 0; i < candidates.length; i++) {
        for (let j = 0; j < candidates.length; j++) {
            if (i !== j && candidates[j].length === candidates[i].length - 1) {
                // Check if one name is missing a single letter
                let missingLetterMatch = true;
                let shorterName = candidates[j];
                let longerName = candidates[i];

                for (let k = 0, l = 0; k < longerName.length; k++) {
                    if (longerName[k] !== shorterName[l]) {
                        if (k !== l) {
                            missingLetterMatch = false;
                            break;
                        }
                    } else {
                        l++;
                    }
                }

                if (missingLetterMatch) {
                    correctedCandidates[j] = longerName;
                }
            }
        }
    }

    return correctedCandidates;
}