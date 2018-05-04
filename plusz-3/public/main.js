"use strict";

var USERLIST_CLIENT_ERROR = "Failed to load user list due to CLIENT error!";
var USERLIST_SERVER_ERROR = "Failed to load user list due to SERVER error!";


function findObject(id) {
    var elem = document.getElementById(id);
    if (!elem) {
        var errorDiv = document.getElementById("div_error");
        errorDiv.innerHTML = USERLIST_CLIENT_ERROR;
        throw new Error("Failed to find object!");
    }

    return elem;
}



function makeCall(maxVal, id) {
    console.log("hessteg ez is works!", maxVal, id);

    var callVal = Math.floor(Math.random() * maxVal);

    var httpReq = new XMLHttpRequest();

    httpReq.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            updateUser(id);
        }
    };

    httpReq.onerror = function () {
        var errorDiv = document.getElementById("div_error");
        if (!errorDiv) {
            return console.error("Error div does not exist!");
        }

        errorDiv.innerHTML = USERLIST_SERVER_ERROR;
    };

    httpReq.open("POST", "/user/call/" + id + "/" + callVal, true);
    httpReq.send(null);
}


function updateUser(id) {
    console.log("Hessteg works!", id);
    var httpReq = new XMLHttpRequest();

    httpReq.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            try {
                var respObj = JSON.parse(this.responseText);

                if (!respObj.success) {
                    return errorDiv.innerHTML = USERLIST_SERVER_ERROR;
                }

                var userData = respObj.user;

                var firstNameElem = findObject("p_firstName");
                var lastNameElem = findObject("p_lastName");
                var addressElem = findObject("p_address");
                var telephoneNumberElem = findObject("p_telephoneNumber");
                var unitElem = findObject("p_unit");

                firstNameElem.innerHTML = "First name: " + userData.firstName;
                lastNameElem.innerHTML = "Last name: " + userData.lastName;
                addressElem.innerHTML = "Address: " + userData.address;

                var teleLink = document.createElement("a");
                teleLink.setAttribute(
                    "href",
                    "javascript:makeCall(" + userData.telephone.units +
                    ", " + id +
                    ");"
                );
                teleLink.innerHTML = userData.telephone.number;
                telephoneNumberElem.innerHTML = "";
                telephoneNumberElem.appendChild(
                    document.createTextNode("Telephone: ")
                );
                telephoneNumberElem.appendChild(teleLink);

                unitElem.innerHTML = "Units: " + userData.telephone.units;
            } catch (err) {
                console.error("Caught inner error:", err.message);
            }
        }
    };

    httpReq.onerror = function () {
        var errorDiv = document.getElementById("div_error");
        if (!errorDiv) {
            return console.error("Error div does not exist!");
        }

        errorDiv.innerHTML = USERLIST_SERVER_ERROR;
    };

    httpReq.open("GET", "/user/find/" + id, true);
    httpReq.send(null);
}


function loadUserList() {
    var errorDiv = document.getElementById("div_error");
    if (!errorDiv) {
        return console.error("Error div does not exist!");
    }

    var httpReq = new XMLHttpRequest();
    httpReq.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // We can load up data:
            var userList = document.getElementById("ul_people");
            if (!userList) {
                return errorDiv.innerHTML = USERLIST_CLIENT_ERROR;
            }

            var respObj = JSON.parse(this.responseText);
            if (!respObj.success) {
                return errorDiv.innerHTML = USERLIST_SERVER_ERROR;
            }

            var userListData = respObj.users;
            for (var i = 0; i < userListData.length; ++i) {
                var userListItem = document.createElement("li");
                var link = document.createElement("a");
                link.setAttribute(
                    "href",
                    "javascript:updateUser(" +
                    userListData[i].id +
                    ");"
                );
                // link.setAttribute("onclick", "updateUser();");
                link.innerHTML = userListData[i].id + " " +
                    userListData[i].firstName + " " + userListData[i].lastName;

                userListItem.appendChild(link);

                userList.appendChild(userListItem);
            }
        }
    };

    httpReq.onerror = function () {
        var errorDiv = document.getElementById("div_error");
        if (!errorDiv) {
            return console.error("Error div does not exist!");
        }

        errorDiv.innerHTML = USERLIST_SERVER_ERROR;
    };

    httpReq.open("GET", "/user/list/", true);
    httpReq.send(null);
}



(function () {
    loadUserList();
})();
