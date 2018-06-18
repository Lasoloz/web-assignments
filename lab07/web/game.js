/*
 Heim László,
 hlim1626
 lab07
 */
"use strict";


(function () {
    function alertMissingElements() {
        alert("Client has missing elements!");
        throw new Error("Client has missing elements!");
    }

    function showInput(numStr) {
        console.log("Time is up!");

        var numDiv = document.getElementById("game-number-to-guess");
        numDiv.hidden = true;

        var timeDiv = document.getElementById("game-time-for-guess");
        timeDiv.hidden = true;

        var resultForm = document.getElementById("game-form");
        if (!resultForm) {
            alertMissingElements();
        }

        resultForm.hidden = false;

        var answerButton = document.getElementById("answer-button");
        if (!answerButton) {
            alertMissingElements();
        }

        answerButton.addEventListener("click", function (event) {
            event.preventDefault();

            var gameAnswer = document.getElementById("game-answer");
            if (!gameAnswer) {
                alertMissingElements();
            }

            var answer = gameAnswer.value;

            if (answer.toString() == numStr) {
                console.log("Correct answer!");

                window.location.replace(
                    "/game/result?client=" + answer);
            } else {
                console.log("Incorrect answer!");

                window.location.replace(
                    "/game/result?client=" + answer);
            }
        });
    }

    function updateTime(time) {
        if (time > 0) {
            var timeElem = document.getElementById("game-time-for-guess");
            timeElem.innerText = "Time remaining to memorize the number: " +
                time + "ms";

            setTimeout(function () {
                updateTime(time - 33);
            }, 33);
        }
    }

    function game(numStr, time) {
        console.log("Game started with numstr:", numStr, "and time:", time);

        if (time < 0) {
            showInput(numStr);
        } else {
            setTimeout(function () {
                updateTime(time - 33);
            }, 33);
            setTimeout(function () {
                showInput(numStr);
            }, time);
        }
    }


    function readTime() {
        var timeElem = document.getElementById("game-time-for-guess");
        if (!timeElem) {
            throw new Error("Client has missing elements!");
            return null;
        }
        var timeContent = timeElem.innerText.match(/[0-9]+/)[0];

        if (!timeContent) {
            throw new Error("No numeric value in timer!");
            return null;
        }

        return parseInt(timeContent);
    }

    function readNumber() {
        var numElem = document.getElementById("game-number-to-guess");
        if (!numElem) {
            throw new Error("Client has missing elements!");
            return null;
        }
        var numContent = numElem.innerText.match(/[0-9]+/)[0];

        if (!numContent) {
            throw new Error("No numeric value in number guess!");
            return null;
        }

        return numContent;
    }

    game(readNumber(), readTime());
})();
