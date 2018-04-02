"use strict";

(function () {
    let histDiv = document.getElementById("historydiv");
    const history = window.history;
    histDiv.innerHTML = history.toString();
    console.log(history);
    console.log(history.state);
})();
