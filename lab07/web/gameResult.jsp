<%--
  Heim László
  hlim1626
  lab07
  Created by IntelliJ IDEA.
  User: heimlaszlo
  Date: 2018.05.21.
  Time: 17:46
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Memory game results</title>
    <meta charset="UTF-8">
    <style>
        span {
            color: red;
        }

        p.original {
            font-weight: bold;
        }
    </style>
</head>
<body>
<h1>Results:</h1>

<h2>Original:</h2>
<p class="original">
    ${originalNumberStr}
</p>

<h2>Your guess:</h2>
<%-- If I don't to this below, then everything is in one line --%>
<p><c:forEach items="${guessNumbers}" var="item"><c:choose><c:when test="${item.bold}"><span>${item.value}</span></c:when><c:otherwise>${item.value}</c:otherwise></c:choose></c:forEach></p>

<h2>Statistics:</h2>
<p>Percentage on level 1: ${percentageLevel1}%</p>
<p>All guesses on level 1: ${levelGuesses1}</p>
<hr>
<p>Percentage on level 2: ${percentageLevel2}%</p>
<p>All guesses on level 2: ${levelGuesses2}</p>
<hr>
<p>Percentage on level 3: ${percentageLevel3}%</p>
<p>All guesses on level 3: ${levelGuesses3}</p>

<button onclick="window.location.replace('/game?level=1');">
    Play on level 1
</button>
<button onclick="window.location.replace('/game?level=2');">
    Play on level 2
</button>
<button onclick="window.location.replace('/game?level=3');">
    Play on level 3
</button>
</body>
</html>
