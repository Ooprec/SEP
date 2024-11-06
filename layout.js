




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

function csvReader(upload) {
    let reader = new FileReader();

}

let selectableTabs = document.getElementsByClassName("selectable-tab");

function selectTab(tab) {
    if (!tab.classList.contains("selected")) {
        let selected = document.getElementsByClassName("selected");
        results = document.getElementById("shown-results");
        if (selected.length != 0) {
            let previous = document.getElementsByClassName("selected")[0];

            previous.classList.toggle("selected");
        }
        
        tab.classList.toggle("selected");
        
        

    }
    else {
        return;
    }
}