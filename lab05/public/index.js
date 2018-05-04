"use strict";

// Global vars:
// ============
var lastOnlineState = true;
var GENERIC_SERVER_ERROR = "Could not communicate with server!";
var GENERIC_CLIENT_ERROR = "Client error!";



// Utilities:
// ==========
function createNotification(message, type) {
    var messageDiv = document.getElementById("div_message");
    if (!messageDiv) {
        return console.error("Failed to acquire messaging div!");
    }

    messageDiv.style.height = "auto";
    messageDiv.childNodes[0].innerHTML = message;
    if (type == "notification") {
        messageDiv.style.backgroundColor = "#00ac4e";
    } else if (type == "error") {
        messageDiv.style.backgroundColor = "#c80006";
    } else if (type == "warning") {
        messageDiv.style.backgroundColor = "#e47501";
    } else {
        messageDiv.style.backgroundColor = "#000";
    }
}

function hideMessage() {
    var messageDiv = document.getElementById("div_message");
    if (!messageDiv) {
        return console.error("Failed to acquire messaging div!");
    }

    messageDiv.style.height = "0";
}



// Offline mode settings:
// ======================
function getNewXmlHttpObject() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    return null;
}


function checkOnline(url) {
    var xmlhttp = getNewXmlHttpObject();
    if (xmlhttp == null) {
        return createNotification("Your browser does not support");
    }

    xmlhttp.onreadystatechange = checkOnlineStateChanged;
    xmlhttp.onerror = checkOnlineRequestError;
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}


function checkOnlineStateChanged() {
    if (this.readyState == 4 && this.status == 200) {
        // navigator.onLine = true;
        if (lastOnlineState == false) {
            createNotification(
                "Services are online again!", "notification"
            );
        }

        lastOnlineState = true;
    }
}

function checkOnlineRequestError() {
    // navigator.onLine = false;
    if (lastOnlineState == true) {
        createNotification(
            "Cannot reach server, using offline fallback!",
            "error"
        );
    }

    lastOnlineState = false;
}



// Flight utilities:
// =================
function selectFromAirport(value) {
    getToAirports(value);
}


function getToAirports() {
    // 0: Get selected item:
    var fromAirportsSelect = document.getElementById("select_fromAirports");
    if (fromAirportsSelect == undefined) {
        return createNotification(GENERIC_CLIENT_ERROR, "error");
    }
    var fromAirportName = fromAirportsSelect
        .options[fromAirportsSelect.selectedIndex].value;

    // 1: Create request:
    var xmlhttp = getNewXmlHttpObject();
    if (xmlhttp == null) {
        return createNotification("Your browser does not support");
    }

    // TODO: Create ajax request
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var respObj = JSON.parse(this.responseText);
            if (respObj == undefined) {
                return createNotification(GENERIC_SERVER_ERROR, "error");
            }
            if (!respObj.success) {
                return createNotification(GENERIC_SERVER_ERROR, "error");
            }

            var toAirportsSelect = document.getElementById("select_toAirports");
            if (toAirportsSelect == undefined) {
                return createNotification(GENERIC_CLIENT_ERROR, "error");
            }

            console.log(respObj);

            toAirportsSelect.childNodes.innerHTML = "<option>Semmi</option>";
        }
    }

    // 2: Send request:
    xmlhttp.onerror = function () {
        createNotification(GENERIC_SERVER_ERROR, "error");
    };
    xmlhttp.open("GET", "/flight/list/" + fromAirportName, true);
    xmlhttp.send(null);
}



// Auto-executed function:
// =======================
(function () {
    // Online state:
    var url = "/alive";

    setInterval(function () { checkOnline(url); }, 3000);

    // Local storage:
    if (window.localStorage == null) {
        createNotification(
            "Your browser does not support HTML5 local storage!",
            "error"
        );
    }
})();
