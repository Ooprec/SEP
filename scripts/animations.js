
// get the HTML elements of the loading bar
var LCont = document.getElementById("Lbar-container");
var LBar = document.getElementById("Lbar-bar");
var LText = document.getElementById("Lbar-text");


// wait
LCont.addEventListener("click", (e) => {
    if (LBar.classList.contains("unstarted"))
    {
        LBar.classList.add("q1");
        LBar.classList.remove("unstarted");
    }

    if (LBar.classList.contains("q5"))
    {
        LText.style.color = "#F2F4F5";
        LBar.classList.remove("q5");
        LBar.classList.add("q1");
    }
})


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
        if (document.getElementById("electionresultscollapsible").classList.contains('active')) {document.getElementById('chartDiv').innerHTML = ''}
        document.getElementById("electionresultscollapsible").click();
        
  }
})
//pulls the run botton from html
var LReload = document.getElementById("download");
//resets finish
var finish = false;
//this runs when run is pressed and it resets the graph code
LReload.addEventListener("click", (e) => {
  finish = false;
  done = false;
})

//pulls the election dropdown from html
var LElection = document.getElementById("electionresultscollapsible");
//resets done
var done = false;
//pulls votes allvotes and candidates from session storage

let second = JSON.parse(sessionStorage.getItem('on-second'));
if (!second) {
  var candidates = JSON.parse(sessionStorage.getItem('holder'));
  var votes = JSON.parse(sessionStorage.getItem('shelby')); 
  var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); 
}
else {
  var candidates = JSON.parse(sessionStorage.getItem('holder-second'));
  var votes = JSON.parse(sessionStorage.getItem('shelby-second')); 
  var allVotes = JSON.parse(sessionStorage.getItem('allVotes-second'));   
}

var round = 0;
//runs the automated graphing code. Activated on the press of election  results
LElection.addEventListener("click", (e) => {
  //updates votes allvotes and candidates from session storage
  


  var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); 
  var candidates = JSON.parse(sessionStorage.getItem('holder'));
  var votes = JSON.parse(sessionStorage.getItem('shelby')); 

  

  //sets the win threshold
  var threshold = allVotes.length/2;
  //makes sure done is reset
  done = false;
  //this while loop continues until a winner of the eleciton is determined
  while(done == false){
    //updates votes allvotes and candidates from session storage
    candidates = JSON.parse(sessionStorage.getItem('holder'));
    votes = JSON.parse(sessionStorage.getItem('shelby')); 
    allVotes = JSON.parse(sessionStorage.getItem('allVotes')); 
    
    //calls the work and count functions. The work function graphs and the count function progresses to the next round.
    work();
    count();
    //updates threshold
    var threshold = allVotes.length/2;
  //terminates the function when a winner is reached
  for(var i in candidates){
    
      if(votes[i] > threshold ){
          done = true
          var winner = candidates[i];
      }
    } 
  }

  let section = document.createElement("h2");
  section.classList.toggle("maroon");
  let indivChartDiv = document.createElement("div");
  indivChartDiv.classList.toggle("election-done-div");
  indivChartDiv.appendChild(section);
  chartDiv.appendChild(indivChartDiv);
  section.innerHTML = "Round 1 Results: " + winner + " has won the election with " + votes[candidates.indexOf(winner)] + " votes";



  removeWinner();

  var allVotes = JSON.parse(sessionStorage.getItem('allVotes-second')); 
  var candidates = JSON.parse(sessionStorage.getItem('holder-second'));
  var votes = JSON.parse(sessionStorage.getItem('shelby-second')); 

  //sets the win thresh old
  var threshold = allVotes.length/2;
  //makes sure done is reset
  done = false;
  //this while loop continues until a winner of the election is determined
  // console.log("first loop done")

  

  vote(allVotes);
  finish = false;
  round = 0;
  while(done == false){
    candidates = JSON.parse(sessionStorage.getItem('holder-second'));
    votes = JSON.parse(sessionStorage.getItem('shelby-second')); 
    allVotes = JSON.parse(sessionStorage.getItem('allVotes-second')); 
    //calls the work and count functions. The work function graphs and the count function progresses to the next round.
    work();
    count();
    //updates threshold
    var threshold = allVotes.length/2;
    //terminates the function when a winner is reached
    for(var i in candidates){
        if(votes[i] > threshold ){
            // console.log(candidates[i] + " has won the election with " + votes[i] + " votes")
            winner = candidates[i];
            done = true
        }
      } 
  }

  let section2 = document.createElement("h2");
  section2.classList.toggle("maroon");
  let sectionDiv = document.createElement("div");
  sectionDiv.classList.toggle("election-done-div");
  sectionDiv.appendChild(section2);
  chartDiv.appendChild(sectionDiv);
  section2.innerHTML = "Round 2 Results: " + winner + " has won the election with " + votes[candidates.indexOf(winner)] + " votes";
  sessionStorage.setItem('on-second', JSON.stringify(false));

})  

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
      if (this.classList.contains("active")) {document.getElementById("chartDiv").innerHTML = "";}

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
    

//this is the makeGraphs function which alows me to streamline the cration of graphs
//I call this function in work().
function makeGraphs() {
  // toggle the 'selected' status for the newly selected tab
  //creates a new chart element in layout.html        // make a new canvas element
  //creates a new bar chart
  let second = JSON.parse(sessionStorage.getItem('on-second'));
  if (!second) 
  {
    var candiadates = JSON.parse(sessionStorage.getItem('holder'));
    //the variable is set the list of counted first votes form the function vote
    var dat = JSON.parse(sessionStorage.getItem('shelby')); 
  }
  else
  {
    var candiadates = JSON.parse(sessionStorage.getItem('holder-second'));
    //the variable is set the list of counted first votes form the function vote
    var dat = JSON.parse(sessionStorage.getItem('shelby-second')); 
  }
   
  return {
    //the type of chart
    type: 'bar',
      //the data within the chart
      data: {
      //the names of each bar underneath the bar
      labels: candiadates,
      datasets: [{
        //the title of the chart
        label: '# of Votes',
        //the integer value of each bar
        //where the variable containing the voting data is used
        data: dat,
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
//cal a function on the click of the count button
// document.getElementById("thingy").addEventListener("click", work);
//the function called by the button. It generates
function work() {
  
    //gets variables from firebase
    let second = JSON.parse(sessionStorage.getItem('on-second'));

    if (!second) {
      var candidates = JSON.parse(sessionStorage.getItem('holder'));
      var votes = JSON.parse(sessionStorage.getItem('shelby')); 
      var allVotes = JSON.parse(sessionStorage.getItem('allVotes')); 
    }
    else {
      var candidates = JSON.parse(sessionStorage.getItem('holder-second'));
      var votes = JSON.parse(sessionStorage.getItem('shelby-second')); 
      var allVotes = JSON.parse(sessionStorage.getItem('allVotes-second')); 
    }


    //the div of the field
    chartDiv = document.getElementById("chartDiv");
    //code that stops the function from running if a winner has already been decided
    if (finish) {
        return;
    }
    //code that stops the function from running if a winner has already been decided
    var threshold = allVotes.length /2;
    for(var i in candidates){
        if(votes[i] > threshold ){
            console.log(candidates[i] + " has won the election with " + votes[i] + " votes")
            let ctx = document.createElement("canvas");
            ctx.classList.toggle("chart")
            let chartSettings2 = makeGraphs();
            new Chart(ctx, chartSettings2);
            ctx.classList.add("anim-flyin")

            let indivChartDiv = document.createElement("div");
            indivChartDiv.classList.toggle("indiv-chart-div-winner");
            indivChartDiv.appendChild(ctx);

            chartDiv.appendChild(indivChartDiv);
  
            // this.classList.add("electionDropdown");
            finish = true
            return;
        }
    }  
    //creates the html componants
    let ctx = document.createElement("canvas");
    ctx.classList.toggle("chart")
    //calls the function makeGraphs which returns the data of the bar chart
    let chartSettings2 = makeGraphs();
    new Chart(ctx, chartSettings2);
    ctx.classList.add("anim-flyin")
    let indivChartDiv = document.createElement("div");
    indivChartDiv.classList.toggle("indiv-chart-div");
    indivChartDiv.appendChild(ctx);

    chartDiv.appendChild(indivChartDiv);
    round++;
    // this.classList.add("electionDropdown");

}

const upload = document.getElementById("csv");
upload.addEventListener("change", (e) => {
  if (upload.value == "") {
    document.getElementById("replacement-button").innerHTML = "Choose File...";
    return;
  }
  console.log(upload.value.split("\\")[2]);
  let fileName = upload.value.split("\\")[2];
  if (fileName.length > 15) {
    fileName = fileName.substring(0, 15) + "...";
  }
  document.getElementById("replacement-button").innerHTML = fileName;

});


const Ubar = document.getElementById("Ubar-bar");

export function Ubarhandler(max, current) {
  Ubar.style.maxWidth = (100*(current/max)) + "%";
}