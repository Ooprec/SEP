
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
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}