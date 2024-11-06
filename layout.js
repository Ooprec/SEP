//imports the chart.js library
src="https://cdn.jsdelivr.net/npm/chart.js"




let inputForm = document.getElementById("uploadForm")

inputForm.addEventListener("change", (e) => {
    let fileButton = document.getElementById("replacement-button");
    let upload = document.getElementById("csv");

    if (upload.value == "")
    {
        fileButton.innerHTML = "Choose File...";
    }
    else {
        fileButton.innerHTML = upload.value.substring(upload.value.indexOf("h\\")+2);
    }
    
});

inputForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Don't clear the input when the submit button is clicked
  
    let upload = document.getElementById("csv");
    // console.log(upload);
    if (upload.value == '')
    {
        alert("Make sure you upload a CSV");
    }
    else
    {   
        console.log(upload.files[0])
        // csvReader(upload);
    }});

let selectableTabs = document.getElementsByClassName("selectable-tab");

function selectTab(tab) {
    if (!tab.classList.contains("selected")) {
        let selected = document.getElementsByClassName("selected");
        results = document.getElementById("shown-results");
        if (selected.length != 0) {
            let previous = document.getElementsByClassName("selected")[0];

            previous.classList.toggle("selected");
            results.innerHTML = '';
        }
        
        tab.classList.toggle("selected");
        //creates a new chart element in layout.html
        const chartDiv = document.createElement("div");
        const ctx = document.createElement("canvas");
        ctx.classList.toggle("chart")
        //creates a new bar chart
        new Chart(ctx, {
            //the type of chart
            type: 'bar',
            //the data within the chart
            data: {
              //the names of each bar underneath the bar
              labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
              datasets: [{
                //the title of the chart
                label: '# of Votes',
                //the integer value of each bar
                data: [12, 19, 3, 5, 2, 3],
                //the width of each bar
                borderWidth: 1
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
          });
          //append the chart to the hmtl element
          results.appendChild(ctx);
          

    }
    else {
        return;
    }
}