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
        return(votes);
}
//     console.log("candidates");
// console.log(candidates);


// find the input section
let inputForm = document.getElementById("uploadForm")

// this handles displaying the filename on the button
inputForm.addEventListener("change", (e) => {
    // find the displayed button
    let fileButton = document.getElementById("replacement-button");
    // find the hidden file upload element
    let upload = document.getElementById("csv");

    // see if the upload is empty
    if (upload.value == "")
    {
        // set a default text
        fileButton.innerHTML = "Choose File...";
    }
    else {
        // take the filename. upload.value is an address, so I just substringed the bad part out.
        fileButton.innerHTML = upload.value.substring(upload.value.indexOf("h\\")+2);
    }
    
});

// this activates when the form is submitted
inputForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Don't clear the input when the submit button is clicked
    
    // find the file upload
    let upload = document.getElementById("csv");

    // if there's no file uploaded
    if (upload.value == '')
    {
        // yell at the user
        alert("Make sure you upload a CSV");
    }
    else
    {   
        // integration with firebase and election algorithm here
    }});


// this function handles changing tabs
function selectTab(tab) {
    // if the selected tab isn't already selected
    if (!tab.classList.contains("selected")) {
        // get the new selected tab
        let selected = document.getElementsByClassName("selected");
        // get the output div
        results = document.getElementById("shown-results");  
        // if a tab is already selected
        if (selected.length != 0) {
            // find the previously selected tab
            let previous = document.getElementsByClassName("selected")[0];
            
            // toggle the 'selected' status
            previous.classList.toggle("selected");

            // clear the output section
            results.innerHTML = '';
        }
        
        // toggle the 'selected' status for the newly selected tab
        tab.classList.toggle("selected");
        //creates a new chart element in layout.html
        const chartDiv = document.createElement("div");
        // make a new canvas element
        const ctx = document.createElement("canvas");
        ctx.classList.toggle("chart")
        //creates a new bar chart
        var graphFunctionArray = [honorGraph, prefectGraph, senateGraph, secretaryGraph];

        index = tab.classList[1];
        chartSettings = graphFunctionArray[index]();
        new Chart(ctx, chartSettings);
        
        //append the chart to the html element
        results.appendChild(ctx);

    }
    else {
        return;
    }
}



function honorGraph() {  
    //bar color
    Chart.defaults.backgroundColor = '#793140D9';  
    //sample candidate data  
    let candiadates = ["a", "b", "c"]
    //sample number of votes
    let dat = [1, 2, 3];
    return {
        //the type of chart
        type: 'bar',
        //the data within the chart
        data: {
          //the names of each bar underneath the bar
          labels: candiadates,

          //somewhere here we should grab the datae
          datasets: [{
            //the title of the chart
            label: '# of Votes',
            //the integer value of each bar
            data: dat,
            //the width of each bar's edge
            borderWidth: 3,
            //the color of the border
            borderColor: '#582235'
          }]
        },
        options: {
          //scaling options for the chart
          scales: {
            y: {
              //starts counting from zero
              beginAtZero: true
            }
          }
        }
      };
    // this will make a graph using the data from an honor election
}

function prefectGraph(ctx) {
    let candiadates = ['boab', 'bober', 'bob3']
    //sample number of votes
    let dat = [3, 5, 7] 
    return {
        type: "polarArea",
        data: {
            labels: candiadates,

            datasets: [{
                //the title of the chart
                label: '# of Votes',
                //the integer value of each bar
                data: dat,
            }]
        }
    }
}
function senateGraph(ctx) {
    // this will make a graph using the data from a senate election
}

function secretaryGraph(ctx) {
    // this will make a graph using the data from a secretary election
}