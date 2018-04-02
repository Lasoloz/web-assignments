/*
 * Heim László, hlim1626, 522-es csoport
 * 2.1-es feladat
*/
"use strict";

/**
 * Write error to error paragraph.
 * @param {string} errorMsg Message to be shown in error paragraph
 */
function writeError(errorMsg) {
    const errorP = document.getElementById("errorParagraph");
    errorP.innerHTML = errorMsg;

    changeHeight();
}


/**
 * Check email field validity
 */
function checkEmail() {
    const userEmail = document.getElementById("userEmailInput");
    const email = userEmail.value;
    console.log("User's email:", email);
    const m = email.match(/^[a-zA-Z0-9\-\_]+@(gmail|yahoo)\.com$/);
    console.log(m);
    if (m === null) {
        writeError("Wrong email format!");
        return false;
    }
    writeError("");
    return true;
}


/**
 * Check homepage field validity
 */
function checkHomepage() {
    const userHomepage = document.getElementById("userHomepageInput");
    const homepage = userHomepage.value;
    console.log("User's homepage:", homepage);
    const m = homepage.match(/^http\:\/\/([a-zA-Z0-9\-\_]+\.)+[a-zA-Z]+$/);
    if (m === null) {
        writeError("Wrong homepage format!");
        return false;
    }
    writeError("");
    return true;
}


/**
 * Check a name field, so we can assure, that it has valid content
 * @param {string} inputID First- or last name field's ID
 */
function checkName(inputID) {
    const input = document.getElementById(inputID);
    const value = input.value;
    const m = value.match(/^[A-Z][a-z]*$/);
    console.log(m);
    return (m !== null);
}


/**
 * Function called by validate button
 */
function validateInput() {
    const d = document.getElementById("dateInput");

    if (!checkEmail() || !checkHomepage()) {
        document.getElementById("submitButton").disabled = true;
        return false;
    }

    if (!checkName("firstNameInput")) {
        writeError("Incorrect first name!");
        document.getElementById("submitButton").disabled = true;
        return false;
    }

    if (d.value.match("^[0-9]+-[0-9]+-[0-9]+$") === null) {
        writeError("Date is not defined!");
        document.getElementById("submitButton").disabled = true;
        return false;
    }

    document.getElementById("submitButton").disabled = false;
    return true;
}


/**
 * Change height of the paragraph based on content
 */
function changeHeight() {
    const errorP = document.getElementById("errorParagraph");
    if (errorP.innerHTML == "") {
        errorP.style.height = "0";
    } else {
        errorP.style.height = "1em";
    }
}


/**
 * Put last modified string into footer
 */
function lastModified() {
    let footer = document.getElementById("docFooter");
    footer.innerHTML = document.lastModified;
    footer.style.textAlign = "center";
}
