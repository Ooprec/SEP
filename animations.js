
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
    console.log("animation ended");
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
    }
})

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {

    if (this.id == "electionresultscollapsible")
      {
        
        results = document.getElementById("Meow");  
        let ctx = document.createElement("canvas");
        ctx.classList.toggle("chart")
        let chartSettings2 = makeGraphs();
        new Chart(ctx, chartSettings2);
        let animDiv = document.createElement("div");
        animDiv.classList.add("anim-flyin");
        animDiv.appendChild(ctx);
        results.appendChild(animDiv);
      }

    // rest of dropdown code
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
        }
      )
      
    
    }
        // this will make a graph using the data from an honor election
        
function makeGraphs() {
   // toggle the 'selected' status for the newly selected tab
   //creates a new chart element in layout.html        // make a new canvas element
   //creates a new bar chart
   let candiadates = JSON.parse(sessionStorage.getItem('holder'));
   //the variable is set the list of counted first votes form the function vote
   let dat = JSON.parse(sessionStorage.getItem('shelby')); 
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
           //where the variable containing the voting data is used
           data: dat,
           //the width of each bar
           borderWidth: 3,
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

}