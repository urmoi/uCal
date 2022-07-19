var libData = {};

function saveLibrary () {
    console.log(libData);
    for (let short in libData) {
        console.log(libData[short]);
        for (let key in libData[short]) { console.log(key, libData[short][key]); }
    }
}

function addItem () {
    
    var itemData = {};

    itemData["short"] = document.getElementById("calShort").value;

    itemData["subject"] = document.getElementById("calSub").value;

    if (document.getElementById("calTime").checked) {
        itemData["time"] = document.getElementById("calStarts").value+"-"+document.getElementById("calEnds").value;
    } else {
        itemData["time"] = "allday";
    }

    itemData["location"] = document.getElementById("calLocal").value;

    itemData["notes"] = document.getElementById("calNotes").value;


    libData[document.getElementById("calShort").value] = itemData;
}