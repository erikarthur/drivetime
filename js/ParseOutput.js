function parseOutput(e) {
    var outputText = document.getElementById("output");
 
    var textToParse = outputText.childNodes[5].firstChild.innerText;
    var driveTimeText = document.getElementById("driveTime");
    
    var needle = /\d+ min/g;

    var strDriveMins = textToParse.match(needle) //matches "2 chapters"
    //var strSingleLineText = driveTimeText.replace(new RegExp("\\n", "g", ""));

    driveTimeText.innerText = "Current: " + strDriveMins[1] + ", No Traffic: " + strDriveMins[0];
 
        
}