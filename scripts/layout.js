// //import "vote.js"

// // find the input section
// let inputForm = document.getElementById("uploadForm")

// // this handles displaying the filename on the button
// inputForm.addEventListener("change", (e) => {
//     // find the displayed button
//     let fileButton = document.getElementById("replacement-button");
//     // find the hidden file upload element
//     let upload = document.getElementById("csv");

//     // see if the upload is empty
//     if (upload.value == "")
//     {
//         // set a default text
//         fileButton.innerHTML = "Choose File...";
//     }
//     else {
//         // take the filename. upload.value is an address, so I just substringed the bad part out.
//         fileButton.innerHTML = upload.value.substring(upload.value.indexOf("h\\")+2);
//     }
    
// });

// // this activates when the form is submitted
// inputForm.addEventListener("submit", (e) => {
//     e.preventDefault(); // Don't clear the input when the submit button is clicked
    
//     // find the file upload
//     let upload = document.getElementById("csv");

//     // if there's no file uploaded
//     if (upload.value == '')
//     {
//         // yell at the user
//         alert("Make sure you upload a CSV");
//     }
//     else
//     {   
//         // integration with firebase and election algorithm here
//     }});


// // this function handles changing tabs
// function selectTab(tab) {
//     // if the selected tab isn't already selected
//     if (!tab.classList.contains("selected")) {
//         // get the new selected tab
//         let selected = document.getElementsByClassName("selected");
//         // get the output div
//         results = document.getElementById("shown-results");  

//         // if a tab is already selected
//         if (selected.length != 0) {
            
//             // find the previously selected tab
//             let previous = document.getElementsByClassName("selected")[0];
            
//             // toggle the 'selected' status
//             previous.classList.remove("selected");
//             previous.classList.add("unselected");

//             // clear the output section
//             results.innerHTML = '';
//         }
        
//         // toggle the 'selected' status for the newly selected tab
//         tab.classList.add("selected");
//         tab.classList.remove("unselected");
//         //creates a new chart element in layout.html
//         let ctx = document.createElement("canvas");
//         ctx.classList.toggle("chart")
//         // make a new canvas element
//         //creates a new bar chart
//         var graphFunctionArray = [honorGraph];

//         index = tab.classList[1];
//         chartSettings = graphFunctionArray[index]();
//         new Chart(ctx, chartSettings);
        
//         let animDiv = document.createElement("div");
//         animDiv.classList.add("anim-flyin");

//         //append the chart to the html element

//         animDiv.appendChild(ctx);

//         results.appendChild(animDiv);

//     }
//     else {
//         return;
//     }
// }



// function honorGraph() {  
//     // Chart.defaults.backgroundColor = '#793140D9';   
//     //temporary list of candiadates because firebas broke :( 
//     let candiadates = JSON.parse(sessionStorage.getItem('holder'));
//     //the variable is set the list of counted first votes form the function vote
//     let dat = JSON.parse(sessionStorage.getItem('shelby')); 
//     return {
//         //the type of chart
//         type: 'bar',
//         //the data within the chart
//         data: {
//           //the names of each bar underneath the bar
//           labels: candiadates,

//           //somewhere here we should grab the datae
//           datasets: [{
//             //the title of the chart
//             label: '# of Votes',
//             //the integer value of each bar
//             //where the variable containing the voting data is used
//             data: dat,
//             //the width of each bar
//             borderWidth: 3,
//             borderColor: '#582235'
//           }]
//         },
//         options: {
//             animation: false,
//           //scaling options for the chart
//           scales: {
//             y: {
//               //starts counting from zero
//               beginAtZero: true
//             }
//           }
//         }
//       };
//     // this will make a graph using the data from an honor election
// }
