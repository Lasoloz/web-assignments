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
            finalizeSavedRequests();
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
        return createNotification(
            "Your browser does not support ajax requests!",
            "error"
        );
    }

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

            if (respObj.success) {
                toAirportsSelect.innerHTML = "";
                toAirportsSelect.appendChild(document.createElement("option"));

                for (var i = 0; i < respObj.toAirports.length; ++i) {
                    var opt = document.createElement("option");
                    opt.setAttribute("value", respObj.toAirports[i]);
                    opt.appendChild(
                        document.createTextNode(respObj.toAirports[i])
                    );
                    toAirportsSelect.appendChild(opt);
                }
            }
        }
    }

    // 2: Send request:
    xmlhttp.onerror = function () {
        createNotification(GENERIC_SERVER_ERROR, "error");
    };
    xmlhttp.open("GET", "/flight/list/" + fromAirportName, true);
    xmlhttp.send(null);
}


function listEventHandler(event) {
    event.preventDefault();

    var fromSelect = document.getElementById("select_fromAirports");
    var toSelect = document.getElementById("select_toAirports");

    if (!fromSelect || !toSelect) {
        return createNotification(GENERIC_CLIENT_ERROR, "error");
    }

    var fromVal = fromSelect.options[fromSelect.selectedIndex].value;
    var toVal = toSelect.options[toSelect.selectedIndex].value;
    if (fromVal == "" || toVal == "") {
        return createNotification(
            "Takeoff airport and destination airport should be both defined!",
            "warning"
        );
    }

    if (!lastOnlineState) {
        var localRequestArray = JSON.parse(
            localStorage.getItem("savedRequests")
        );
        if (!localRequestArray) {
            return createNotification(GENERIC_CLIENT_ERROR, "error");
        }
        localRequestArray.push({ fromVal, toVal });
        localStorage.setItem(
            "savedRequests", JSON.stringify(localRequestArray)
        );
        return createNotification(
            "Request saved until offline mode!", "notification"
        );
    }

    // Clear old content:
    var listDiv = document.getElementById("flightList");
    if (!listDiv) {
        return createNotification(GENERIC_CLIENT_ERROR, "error");
    }
    listDiv.innerHTML = "";
    makeFlightRequest(fromVal, toVal);
}



function finalizeSavedRequests() {
    var listDiv = document.getElementById("flightList");
    if (!listDiv) {
        return createNotification(GENERIC_CLIENT_ERROR, "error");
    }
    listDiv.innerHTML = "";

    var localRequestArray = JSON.parse(localStorage.getItem("savedRequests"));
    if (!localRequestArray) {
        return createNotification(GENERIC_CLIENT_ERROR, "error");
    }
    for (var i = 0; i < localRequestArray.length; ++i) {
        var req = localRequestArray[i];

        makeFlightRequest(req.fromVal, req.toVal);
    }

    localStorage.setItem("savedRequests", JSON.stringify([]));
}


function createEmphasized(textVal) {
    var emElem = document.createElement("strong");
    emElem.appendChild(document.createTextNode(textVal));

    return emElem;
}

function appendListPart(listElem, label, val) {
    listElem.appendChild(createEmphasized(label));
    listElem.appendChild(document.createTextNode(val));
    listElem.appendChild(document.createElement("br"));
}


function makeFlightRequest(fromVal, toVal) {
    var xmlhttp = getNewXmlHttpObject();
    if (xmlhttp == null) {
        return createNotification(
            "Your browser does not support ajax requests!",
            "error"
        );
    }

    xmlhttp.onreadystatechange = function addFlightToList() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var respObj = JSON.parse(this.responseText);
            if (!respObj.success) {
                return createNotification(
                    "Failed to query flights between two cities!", "error"
                );
            }

            var listDiv = document.getElementById("flightList");
            if (!listDiv) {
                return createNotification(GENERIC_CLIENT_ERROR, "error");
            }

            var flights = respObj.flights;

            var heading = document.createElement("h3");
            heading.appendChild(document.createTextNode("Requested flights:"));
            listDiv.appendChild(heading);

            for (var i = 0; i < flights.length; ++i) {
                var listElem = document.createElement("div");
                listElem.setAttribute("class", "list-elem");

                appendListPart(listElem, "From: ", flights[i].fromAirport);
                appendListPart(listElem, "To: ", flights[i].toAirport);
                appendListPart(listElem, "Airline: ", flights[i].airline);
                appendListPart(listElem, "Start date: ", flights[i].startDate);
                appendListPart(listElem, "End date: ", flights[i].endDate);
                appendListPart(
                    listElem, "Flight number: ", flights[i].flightNumber
                );

                listDiv.appendChild(listElem);
            }
        }
    };

    xmlhttp.onerror = function () {
        createNotification(GENERIC_SERVER_ERROR, "error");
    }

    xmlhttp.open("GET", "/flight/" + fromVal + "/" + toVal, true);
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

    // Add list button event:
    var listButton = document.getElementById("listFlights");
    if (!listButton) {
        createNotification(GENERIC_CLIENT_ERROR, "error");
    } else {
        listButton.addEventListener("click", listEventHandler);
    }

    // Create saved requests array in local storage:
    localStorage.setItem("savedRequests", JSON.stringify([]));
})();
