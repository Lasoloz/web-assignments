<%--
  Created by IntelliJ IDEA.
  User: heimlaszlo
  Date: 2018.05.31.
  Time: 16:15
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Gaspricen't</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>Gaspricen't</h1>
    <form action="/" method="post">
        <label for="country">Country: </label>
        <input name="country" id="country" type="text">
        <br>

        <label for="money">Money: </label>
        <input name="money" id="money" type="number">
        <br>

        <button>Get fuel price</button>
    </form>

    <c:forEach items="${fuelDataList}" var="elem">
        <p>Country: ${elem.country} - money: ${elem.money} - litres bought: ${elem.litres} <a href="/delete?name=${elem.country}">Delete</a></p>
    </c:forEach>

    <a href="/deleteAll">Delete all</a>
</body>
</html>
