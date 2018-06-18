<%--
  Created by IntelliJ IDEA.
  User: heimlaszlo
  Date: 2018.06.07.
  Time: 16:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Statistics of players</title>
    <meta charset="UTF-8">
    <style>
        div.player {
            border: 1px solid black;
        }

        span {
            font-weight: bold;
        }
    </style>
</head>
<body>
<div>
    <h1>List of players:</h1>
    <c:forEach items="${players}" var="player">
        <div class="player">
            <p><span>player: </span>${player.name}</p>
            <p><span>price: </span>${player.value}$</p>
            <c:forEach begin="1" end="${player.rating}">★</c:forEach>
            <p><a href="/?sale=${player.id}">Sale player</a></p>
        </div>
    </c:forEach>
</div>
<hr>
<div>
    <h1>Introduce new player:</h1>
    <form method="post">
        <label for="player-name">Name: </label><input id="player-name" name="playerName" type="text"><br>
        <label for="player-value">Value: </label><input id="player-value" name="playerValue" type="number"><br>
        <label for="player-rating">Rating: </label><select id="player-rating" name="playerRating">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
        </select><br>
        <button>Add new football player</button>
    </form>
</div>
<hr>
<p>Total value: ${total}$</p>
<p>Average rating: ${avgRating}</p>
</body>
</html>
