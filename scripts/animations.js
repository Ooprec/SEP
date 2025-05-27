import { getCollectionList } from "./upload.js";
import {newCount, newVote, loadFromDatabase, initVote} from "./vote.js";


// get the HTML elements of the loading bar
// var LCont = document.getElementById("Lbar-container");
try{
var LBar = document.getElementById("Lbar-bar");
var LText = document.getElementById("Lbar-text");



LBar.addEventListener("animationend", (e) => {
    if (LBar.classList.contains("q1"))
    {
        LText.style.color = "#582235";
        LText.innerHTML = "Stuffing ballot boxes...";
        LBar.classList.add("q2");
        LBar.classList.remove("q1");
    }
    else if (LBar.classList.contains("q2"))
    {
        LText.innerHTML = "Gerrymandering..."
        LBar.classList.add("q3");
        LBar.classList.remove("q2");
    }
    else if (LBar.classList.contains("q3"))
    {
        LText.innerHTML = "Bribing officials..."
        LBar.classList.add("q4");
        LBar.classList.remove("q3");
    }
    else if (LBar.classList.contains("q4"))
    {
        LText.innerHTML = "Contesting results..."
        LBar.classList.add("q5");
        LBar.classList.remove("q4");
    }
    else if (LBar.classList.contains("q5"))
    {
        LText.innerHTML = "Election complete!"
        // if (document.getElementById("electionresultscollapsible").classList.contains('active')) {document.getElementById('chartDiv').innerHTML = ''}
        // document.getElementById("electionresultscollapsible").click();
        
  }
})
} catch{
  console.log("something, sebastian will fix this message later")
}
// resets done
const toggleSwitch = document.querySelector("#toggle-switch input");

var coll = document.getElementsByClassName("collapsible");
var i;


for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    if (this.id == "electionresultscollapsible" && !this.classList.contains("active"))
      {
          this.classList.add("electionDropdown");
          if (this.classList.contains("active"))
          {
            
          }
      }
      if (this.classList.contains("active")) {}

    // rest of dropdown code
    
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      if (content.id == "election-results")
      {
        content.style.maxHeight = "fit-content";
      }
      else{
        content.style.maxHeight = content.scrollHeight + "px";
      }
    }
        }
      )
}

    
function makeGraphs2(candidates, data, round) {
  //creates a new chart element in layout.html        
  if (candidates.length != data.length) {
    console.error("Candidates and data length mismatch.");
    return;
  }
  return {
    //the type of chart
    type: 'bar',
      //the data within the chart
      data: {
      //the names of each bar underneath the bar
      labels: [...candidates],
      datasets: [{
        //the title of the chart
        label: '# of Votes',
        //the integer value of each bar
        //where the variable containing the voting data is used
        data: [...data],
        //the width of each bar
        borderWidth: 3,
        borderColor: '#582235'
        }]
      },
      options: {
        animation: false,
        //scaling options for the chart
        scales: {
          y: {
          //starts counting from zero
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {  
          title: {
            display: true,
            text: 'Round '+round,
            color: '#582235',
            font: {
              size: 20
            }
          }
       }
     }
  }
}

// Add an event listener for the custom event that's triggered by the run button
document.addEventListener("displayRounds", async (e) => {
  // total # of rounds
  var totalRounds = 0;

  // check if the session storage is ready to go
  async function beforeStart() {
    // Check if session storage items are set
    if (!sessionStorage.getItem('holder') || !sessionStorage.getItem('shelby') || !sessionStorage.getItem('allVotes')) {
      console.error("Required session storage items are missing.");
      
    }
    else {return true;}
    
  }

  console.log("Displaying rounds and graphs...");

  // returns a div with the graph of the round
  // this function is called in the while loop of handleRoundsAndGraphs
  async function makeGraphDivPerRound(candidates, votes, round) {
    // make the chart element
    let ctx = document.createElement("canvas");
    // give it the class of chart
    ctx.classList.add("chart");

    let chartSettings = makeGraphs2(candidates, votes, round);
    new Chart(ctx, chartSettings);

    let indivChartDiv = document.createElement("div");
    indivChartDiv.classList.add("indiv-chart-div");
    indivChartDiv.classList.add("vote-graph");
    indivChartDiv.appendChild(ctx);
    return indivChartDiv;
  }


  // gets the archived data from session storage
  // this function is called in the beginning of the script and between rounds
  async function getArchivedData() {
    // await loadFromDatabase();
    try 
    {
      // get the name of the election
      let cname = document.getElementById("csv-options").value;
      // get the archived data from session storage
      let archivedData = JSON.parse(sessionStorage.getItem(cname + '-archived'));
      // if the data exists, return it
      if (archivedData) {
        let allVotes = archivedData.allVotes;
        let candidates = archivedData.candidates;
        let votes = archivedData.shelby;
        return {
          allVotes: [...allVotes],
          candidates: [...candidates],
          votes: [...votes]
        }
      } 
      else {
        console.error("Archived data not found in session storage.");
        return null;
      }
    }
    catch (error) {
      console.error("Error retrieving archived data:", error);
      return null;
    }
  }

  // runs the round
  // this function is called in the while loop of handleRoundsAndGraphs
  async function runRound(candidates, votes, allVotes, round) {
    // get the results from the next round of elimination
    let roundResults = await newCount(votes, candidates, allVotes);
    return { 
      results: await makeGraphDivPerRound(roundResults.candidates, roundResults.votes, round),
      candidates: [...roundResults.candidates],
      votes: [...roundResults.votes],
      allVotes: [...roundResults.allVotes],
      round: round+1,
    }
  }

  // remove the round 1 winner from the candidates and votes
  // this function is called between the first and second rounds
  async function removeWinner(archivedData, winner) 
  {
    let candidates = [...archivedData.candidates];
    let votes = [...archivedData.votes];
    let allVotes = [...archivedData.allVotes];

    for (var i in candidates) 
    {
      if (candidates[i] == winner)
      {
        candidates.splice(i, 1);
        votes.splice(i, 1);

        for (let i in allVotes)
        {
          let voter = allVotes[i];
          if (voter.indexOf(winner) >= 0)
          {
              voter.splice(voter.indexOf(winner),1);
              voter.push(null)
          }
          if (voter[0] == null && voter[1] == null && voter[2] == null)
          {
              allVotes.splice(i,1);
          }
        }

        let results = await newVote(allVotes, candidates);

        sessionStorage.setItem('holder', JSON.stringify(results.candidates));
        sessionStorage.setItem('shelby', JSON.stringify(results.votes));
        sessionStorage.setItem('allVotes', JSON.stringify(allVotes));
        
        return {
          candidates: [...results.candidates],
          votes: [...results.votes],
          allVotes: [...allVotes],
        }
      }
    }
  }
  
  // the core loop of this script
  // this does one election round, finding one winner
  async function handleRoundsAndGraphs() {
    totalRounds++;
    var winningVotes = 0;
    
    // check if the session storage is ready to go
    let ready = await beforeStart()

    // if not, alert the user
    if (!ready) {
      alert("There are no elections to run");
    }

    // set up all the variables
    var candidates = JSON.parse(sessionStorage.getItem('holder'));
    var votes = JSON.parse(sessionStorage.getItem('shelby'));
    var allVotes = JSON.parse(sessionStorage.getItem('allVotes'));
    let round = 1;

    var chartDiv = document.getElementById("chartDiv");

    let limit = 0;
    var running = true;
    var runningBefore = true;
    
    var threshold = allVotes.length;
    
    var winner;
    
    while (running)
    {
      if (!winner) {chartDiv.appendChild(await makeGraphDivPerRound(candidates, votes, round));}
  
      let totalVotes = votes.reduce((sum, voteCount) => sum + voteCount, 0);
      threshold = Math.floor(totalVotes/2);
     
      limit++;

      let roundResults = await runRound(candidates, votes, allVotes, round);

      votes = [...roundResults.votes];
      candidates = [...roundResults.candidates];
      allVotes = [...roundResults.allVotes];
      round = roundResults.round;
      
      if (!runningBefore) {running = false};

      totalVotes = votes.reduce((sum, voteCount) => sum + voteCount, 0);
      threshold = Math.floor(totalVotes/2);

      // check for winning
      for (var i in votes) { 
        if (votes[i] >= threshold) {
          console.log("winner winner chicken dinner")
          runningBefore = false;
          winner = candidates[i];
          winningVotes = votes[i];
          chartDiv.appendChild(await makeGraphDivPerRound(candidates, votes, round));
        }
      }
      
    }
    
    return {
      winner: winner,
      winningVotes: winningVotes,
    };
  }

  async function betweenRounds(winner, round, chartDiv, winningVotes)
  {
    let section2 = document.createElement("p");
    

    let sectionDiv = document.createElement("div");
    sectionDiv.classList.toggle("light");
    sectionDiv.classList.toggle("winning-text");

    sectionDiv.appendChild(section2);
    chartDiv.appendChild(sectionDiv);
    let text = [null, "first", "second"];
    
    section2.innerHTML = `${winner}  has won the ${text[round]} seat with ${winningVotes} votes`;
  }

function checkDisplay() {
    const currentElection = document.getElementById("csv-options").value;
    const displayedElection = chartDiv.getAttribute("data-election");

    if (displayedElection && displayedElection !== currentElection) {
      while (chartDiv.firstChild) {
        chartDiv.removeChild(chartDiv.firstChild);
      }
    }
    else if (displayedElection == currentElection) 
    {
      return false
    }

    chartDiv.setAttribute("data-election", currentElection);
    return true;
  }

  function makeHeader(round) {
    let header = document.createElement("h2");
    header.classList.toggle("maroon");
    let headerDiv = document.createElement("div");
    headerDiv.classList.toggle("election-done-div");
    header.innerHTML = `Seat ${round} Results`;
    headerDiv.appendChild(header);

    chartDiv.appendChild(headerDiv);
    return header;
  }

  if (checkDisplay())
  {
    makeHeader(totalRounds+1);
    var firstWinningData = await handleRoundsAndGraphs();
    var archivedData = await getArchivedData();
    
    var firstWinner = firstWinningData.winner;
    var firstWinningVotes = firstWinningData.winningVotes;

    await betweenRounds(firstWinner, totalRounds, chartDiv, firstWinningVotes);
    makeHeader(totalRounds+1);
    var newData = await removeWinner(archivedData, firstWinner);

    var candidates = [...newData.candidates];
    var votes = [...newData.votes];
    var allVotes = [...newData.allVotes];
    
    sessionStorage.setItem('holder', JSON.stringify(candidates));
    sessionStorage.setItem('shelby', JSON.stringify(votes));
    sessionStorage.setItem('allVotes', JSON.stringify(allVotes));

    var secondWinningData = await handleRoundsAndGraphs();
    
    var secondWinner = secondWinningData.winner;
    var secondWinningVotes = secondWinningData.winningVotes;
    await betweenRounds(secondWinner, totalRounds, chartDiv, secondWinningVotes);

    // run the point based voting function
    newPoint();
  }
});

try{
const csvOptions = document.getElementById("csv-options");

// this function is called when the user selects a new election from the dropdown menu
// it checks if the data is already in session storage, and if not, it downloads it from the database
try{
csvOptions.addEventListener("change", async (e) => {

  const selectedOption = e.target.value;
  if (!sessionStorage.getItem(`${selectedOption}-archived`)) {
    console.log(`Archived data for ${selectedOption} not found. Downloading...`);
    try {
      await loadFromDatabase();
      console.log(`Archived data for ${selectedOption} has been downloaded.`);
    } catch (error) {
      console.error("Error downloading archived data:", error);
    }
  } else {
    console.log(`Archived data for ${selectedOption} already exists. Grabbing data...`);
    var archivedData = JSON.parse(sessionStorage.getItem(`${selectedOption}-archived`));
    let allVotes = [...archivedData.allVotes];
    let voteResults = await initVote(allVotes);
    sessionStorage.setItem('shelby', JSON.stringify([...voteResults.votes]));
    sessionStorage.setItem('holder', JSON.stringify([...voteResults.candidates]));
    sessionStorage.setItem('allVotes', JSON.stringify([...allVotes]));


    console.log("Archived data:", archivedData);
  }
}); 
}catch{
  console.log("something, sebastian will fix this message later")
}



// this function is called in the point based voting function
function makePointGraph(candidates, data) {
  //creates a new chart element in layout.html        
  if (candidates.length != data.length) {
    console.error("Candidates and data length mismatch.");
    return;
  }
  return {
    //the type of chart
    type: 'bar',
      //the data within the chart
      data: {
      //the names of each bar underneath the bar
      labels: [...candidates],
      datasets: [{
        //the title of the chart
        label: '# of points',
        //the integer value of each bar
        //where the variable containing the voting data is used
        data: [...data],
        //the width of each bar
        borderWidth: 3,
        borderColor: '#582235'
        }]
      },
      options: {
        animation: false,
        //scaling options for the chart
        scales: {
          y: {
          //starts counting from zero
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {  
          title: {
            display: true,
            text: 'Point-based Voting',
            color: '#582235',
            font: {
              size: 20
            }
          }
        }
      }
  }

}

// my new and improved point based voting function
// this function is called a lot
function newPoint() {
  const cname = document.getElementById("chartDiv").getAttribute("data-election");
  var archivedData = JSON.parse(sessionStorage.getItem(cname+'-archived'));
  var candidates = archivedData.candidates;
  var allVotes = archivedData.allVotes;
  var points = [];

  // make the points array the same length as the candidates array
  for (let i in candidates) 
  {
    points.push(0);
  }

  // tally up the points
  for (let i in allVotes) 
  {
    var vote = allVotes[i];
    for (let j in candidates) 
    {
      if (vote[0] == candidates[j]) 
      {
        points[j] += 5;
      }
      else if (vote[1] == candidates[j]) 
      {
        points[j] += 3;
      }
      else if (vote[2] == candidates[j])
      {
        points[j] += 1;
      }
    }
  }

  const pointDiv = document.getElementById("point_graph");

  if (pointDiv.getAttribute("data-election") == cname) {
    // do nothing, the graphs are already displayed
    return;
  }
  else {

    pointDiv.innerHTML = ""; // Clear previous content
    // say which election the graphs are for
    pointDiv.setAttribute("data-election", cname);

    let chartData = makePointGraph(candidates, points);

    let ctx = document.createElement("canvas");
    ctx.classList.add("chart");
    new Chart(ctx, chartData);

    let indivChartDiv = document.createElement("div");
    indivChartDiv.classList.add("indiv-chart-div");
    indivChartDiv.classList.add("point-graph");
    indivChartDiv.appendChild(ctx);

    pointDiv.appendChild(indivChartDiv);
  }
  

  // find the winner and second place
  let winningVotes = Math.max(...points);
  let winner = candidates[points.indexOf(winningVotes)];
  let winnerIndex = points.indexOf(winningVotes);
  points.splice(winnerIndex, 1); // Remove the first place points
  candidates.splice(winnerIndex, 1); // Remove the first place candidate
  let secondWinningVotes = Math.max(...points); // Find the second highest points
  let secondWinner = candidates[points.indexOf(secondWinningVotes)]; // Find the corresponding candidate

  // create the div for the results
  let section2 = document.createElement("h2");
  section2.classList.toggle("maroon");
  let sectionDiv = document.createElement("div");
  sectionDiv.classList.toggle("election-done-div");
  sectionDiv.appendChild(section2);
  pointDiv.appendChild(sectionDiv);

  section2.innerHTML = `Point-Based Voting Results: ${winner}  has won the election with ${winningVotes} points. <br> ${secondWinner} has come in second with ${secondWinningVotes} points`;
}

const Ubar = document.getElementById("Ubar-bar");
const UbarText = document.getElementById("Ubar-text");
// UbarText.style.fontSize = "12pt";

export function Ubarhandler(max, current) {
  Ubar.style.maxWidth = (100*(current/max)) + "%";
  UbarText.style.color = "#582235";
  UbarText.innerHTML = Math.floor(100*(current/max)) + "%";
  if (UbarText.innerHTML == "100%") {
    UbarText.innerHTML = "Done!";   
  }
}

const pointGraph = document.getElementById("point_graph");
const chartDiv = document.getElementById("chartDiv");

try{
toggleSwitch.addEventListener("change", (e) => {
  if (e.target.checked) {
    console.log("Switched to Point-Based Voting");
    // Add logic for Point-Based Voting
    chartDiv.style.display = "none";
    pointGraph.style.display = "block";
    // newPoint();
    
  } else {
    chartDiv.style.display = "grid";
    pointGraph.style.display = "none";
    
    // Add logic for Rank Choice Voting
  }
});
}
catch{
  console.log("oops");
}
