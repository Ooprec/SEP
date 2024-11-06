
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
        const chartDiv = document.createElement("div");
        const ctx = document.createElement("canvas");
        ctx.classList.toggle("chart")
        new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
              datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        
          results.appendChild(ctx);
          

    }
    else {
        return;
    }
}