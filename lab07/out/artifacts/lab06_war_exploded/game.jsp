<%--
  Created by IntelliJ IDEA.
  User: heimlaszlo
  Date: 2018.05.21.
  Time: 16:59
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Memory game</title>
    <meta charset="UTF-8">
</head>
<body>
<h1>Memory game</h1>
<div id="game-number-to-guess">${numberToGuess}</div>
<div id="game-time-for-guess">${timeForGuess}</div>
<form id="game-form" hidden>
    <input id="game-answer" type="text" name="game-answer">
    <button id="answer-button">Guess</button>
</form>

<script src="/game.js"></script>
</body>
</html>
