const url = "https://api.aredl.net/api/aredl/levels";
const profiles = "https://api.aredl.net/api/aredl/profiles"

var data = [];
fetchdata();

async function fetchdata() {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to load data');
    }

    // Convert data to JSON
    const info = await response.json();
    console.log("Data Collected From AREDL");
    data = info;
    
};


// Levels Info
var easydemons = 0;
var mediumdemons = 0;
var harddemons = 0;
var insanedemons = 0;

// Extreme Demons
var extremedemons = [];

//Hardest
var hardest = 0;
var hardeststr = "None";


// Get Points
function getPoints(level) {
    
    for (const elem of data) {
        if (format(elem["name"]) == format(level)) {

            if (elem["legacy"] == true){
                return "level not found";
            }

            return elem["points"];
        }
    };

    return "level not found";
};

//Format Text
function format(text) {
    return text.toLowerCase().split(' ').join('')
};

// Check If Extreme Exists 
function checkLevel(level) {
    for (const elem of data) {
        if (format(elem["name"]) == format(level)) {

            if (elem["legacy"] == true){
                return false;
            }

            return true;
        }
    };

    return false;
};

//Gets Level ID
function unformatName(levelname) {
    for (const elem of data) {
        if (format(levelname) == format(elem["name"])) {
            return elem["name"].trim();
        }
    }
};

// Update Non Extremes lol
function updatenonextremes() {
    easydemons = document.getElementById("easydemons").value;
    document.getElementById("infoed").textContent = "Easy Demons : " + String(easydemons);

    mediumdemons = document.getElementById("mediumdemons").value;
    document.getElementById("infomd").textContent = "Medium Demons : " + String(mediumdemons);

    harddemons = document.getElementById("harddemons").value;
    document.getElementById("infohd").textContent = "Hard Demons : " + String(harddemons);

    insanedemons = document.getElementById("insanedemons").value;
    document.getElementById("infoid").textContent = "Insane Demons : " + String(insanedemons);
};

// Add new extreme
function addnewextreme() {
    var level = document.getElementById("extremedemons").value;
    level = unformatName(level);

    if (checkLevel(level) == true) {

        if (!extremedemons.includes(level)) {
            extremedemons.push(level);
        }
        
    }
    else {
        document.getElementById("extremedemons").textContent = "Level Not Found";
    };

    var output = "";

    for (const elem of extremedemons) {
        output = output + ", " + elem
    };

    document.getElementById("infoexd").textContent = "Extreme Demons : " + output;
};

// Add new extreme by name
function addnewextremeByName(name) {
    var level = name
    level = unformatName(level);

    if (checkLevel(level) == true) {
        if (!extremedemons.includes(level)) {
            extremedemons.push(level);
        }
    }
    else {
        document.getElementById("extremedemons").textContent = "Level Not Found";
    };

    var output = "";

    for (const elem of extremedemons) {
        output = output + ", " + elem
    };

    document.getElementById("infoexd").textContent = "Extreme Demons : " + output;
};

//Find Hardest
function findhardest() {
    value = 0;
    txt = "Non Demon";

    if (easydemons > 0) {
        value = 1;
        txt = "Easy Demon";
    };

    if (mediumdemons > 0) {
        value = 2;
        txt = "Medium Demon";
    };

    if (harddemons > 0) {
        value = 3;
        txt = "Hard Demon";
    };

    if (insanedemons > 0) {
        value = 4;
        txt = "Insane Demon";
    };

    
    if (extremedemons.length > 0) {
        value = 5
        hardestEx = ""
        points = 0

        console.log(extremedemons);

        for (const extreme of extremedemons) {

            if (getPoints(extreme) > points) {
                points = getPoints(extreme);
                hardestEx = extreme
            }
        }

        txt = hardestEx;
    };

    hardest = value;
    hardeststr = txt;

    document.getElementById("hardest").textContent = "Hardest : " + hardeststr;
}

// Calculate skill using formula
function calcSkill() {
    findhardest();
    points = 0

    var e = easydemons;
    var m = mediumdemons;
    var h = harddemons;
    var i = insanedemons;

    if (e > 10){
        e = 10 + ((e-10) / 10)

        if (e>50) {
            e = 50
        }

    }
    if (m > 10){
        m = 10 + ((m-10) / 10)

        if (m>50) {
            m = 50
        }
    }
    if (h > 10){
        h = 10 + ((h-10) / 10)

        if (h>50) {
            h = 50
        }
    }
    if (i > 10){
        i = 10 + ((i-10) / 10)

        if (i>50) {
            i = 50
        }
    }


    if (hardest == 1) {
        points += 100

        points += 10 * ((e - 1) / 2)
    } 

    else if (hardest == 2) {
        points += 200

        points += 20 * ((m - 1) / 2)
        points += 10 * (e / 2)
    } 

    else if (hardest == 3) {
        points += 350

        points += 35 * ((h - 1) / 2)
        points += 20 * (m / 2)
        points += 10 * (e / 2)
    } 

    else if (hardest == 4) {
        points += 500

        points += 50 * ((i - 1) / 2)
        points += 35 * (h / 2)
        points += 20 * (m / 2)
        points += 10 * (e / 2)
    }

    else if (hardest == 5) {
        points += 1000
  
        points += 50 * (i / 2)
        points += 35 * (h / 2)
        points += 20 * (m / 2)
        points += 10 * (e / 2)

        points += getPoints(hardeststr) * 100
        
        points += 100 * ((extremedemons.length - 1) / 2)

        for (const extreme of extremedemons) {
            points += getPoints(extreme) / extremedemons.length
        }

        points -= getPoints(hardeststr) / extremedemons.length
    }

    console.log(points);
    document.getElementById("skillpts").textContent = "Skill Points : " + String(points);
}

// Profile
async function loadProfile() {
    id = document.getElementById("aredlinput").value;
    const response = await fetch(profiles + "/" + id);

    if (!response.ok) {
        throw new Error('Failed to load data');
    }

    // Convert data to JSON
    const info = await response.json();
    console.log("Players Profile Collected From AREDL");
    console.log(info);

    console.log(info["records"]);

    for (const level of info["records"]) {
        value = level["level"]["name"];
        console.log(value);
        addnewextremeByName(value);
    }
}
