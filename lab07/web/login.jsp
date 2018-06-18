<%--
  Heim László
  hlim1626
  lab07
  Created by IntelliJ IDEA.
  User: heimlaszlo
  Date: 2018.05.17.
  Time: 8:28
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Login page</title>
</head>
<body>
<h1>Log in:</h1>
<form action="login.do" method="post">
    <label for="username-input">Username:</label>
    <input type="text" name="username" id="username-input" value="${username}"><br>
    <label for="password-input">Password:</label>
    <input type="password" name="password" id="password-input" value="${password}"><br>
    <button>Log in</button>
</form>
<c:if test="${not empty message}">
    <p style="color:red;">${message}</p>
</c:if>
</body>
</html>
