//import "vote.js"

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
        //creates a new chart element in layout.html        // make a new canvas element
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
    // Chart.defaults.backgroundColor = '#793140D9';   
    //temporary list of candiadates because firebas broke :( 
    let candiadates = ['boab', 'bober', 'bob3', "four", "five", "six", "seven", "eight", "nine"];
    //the variable is set the list of counted first votes form the function vote
    let dat = JSON.parse(sessionStorage.getItem('shelby')); 
    console.log("data");

    console.log(dat);
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
    // this will make a graph using the data from an honor election
}

function prefectGraph(ctx) {
    //cool graph that we made
    let candidates = ["bob", "boab", "booooaaaab"," timothy","bob3","Dr. Robert Troy, PhD."]
    let datfirst = [1,2,3,4,5,6];
    let datsecond = [3,5,4,1,2,6];
    let datthird = [5,2,3,4,1,6];
    // this will make a graph using the data from a prefect election
    return {
        type: "radar",
        data: {
            labels: candidates,
            datasets: [{
                label: "First Votes",
                data: datfirst},
                {label: "Second Votes",
                    data: datsecond,
                },{label: "Third Votes",
                    data: datthird,
                }]

        }
    }
}

function senateGraph(ctx) {
    // this will make a graph using the data from a senate election
    let candidates = ["bob", "boab", "booooaaaab"," timothy","bob3","Dr. Robert Troy, PhD."]
    let datfirst = [1,3,2,5,4,6];

    return {
        type: "polarArea",
        data: {
            labels: candidates,
            datasets: [{label: "Votes", data: datfirst}],
        },
        options: {
            circular: true,
            borderJoinStyle: 'bevel'
        }
    }
}

function secretaryGraph(ctx) {
    // this will make a graph using the data from a secretary election
}

const sel = document.querySelector('.sel');
const label = document.querySelector('.label');
const options = document.querySelector('.options');

options.setAttribute('hidden', true);

sel.addEventListener('click', (e) => {
    e.stopPropagation();
    options.removeAttribute('hidden');
});

document.body.addEventListener('click', (e) => {
    options.setAttribute('hidden', true);
});

options.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIV') {
        e.stopPropagation();
        label.textContent = e.target.textContent;
        e.target.classList.add('selected');
        Array.from(e.target.parentNode.children).forEach((child) => {
            if (child !== e.target) {
                child.classList.remove('selected');
            }
        });
        options.setAttribute('hidden', true);
    }
});