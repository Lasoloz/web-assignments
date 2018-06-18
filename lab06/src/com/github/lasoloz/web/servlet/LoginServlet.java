package com.github.lasoloz.web.servlet;

import com.github.lasoloz.web.servlet.dao.DBProvider;
import com.github.lasoloz.web.servlet.dao.User;
import com.mongodb.MongoException;
import com.mongodb.client.MongoCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

@WebServlet(urlPatterns = "/login.do")
public class LoginServlet extends HttpServlet {
    private static Logger LOGGER = LoggerFactory.getLogger(LoginServlet.class);
    private static String webpage0 = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <title>Login</title>\n" +
            "</head>\n" +
            "<body>\n" +
            "    <h1>Log in:</h1>\n" +
            "    <p>";
    private static String webpage1 = "</p>\n" +
            "    <form action=\"/login.do\" method=\"post\">\n" +
            "        <label for=\"username-input\">Username:</label>\n" +
            "        <input id=\"username-input\" name=\"username\" " +
            "type=\"text\" value=\"";
    private static String webpage2 = "\"/><br />\n" +
            "        <label for=\"password-input\">Password:</label>\n" +
            "        <input id=\"password-input\" name=\"password\" " +
            "type=\"password\" value=\"";
    private static String webpage3 = "\"/><br />\n" +
            "        <button>Log in</button>\n" +
            "    </form>\n" +
            "</body>\n" +
            "</html>";

    MongoCollection<User> userCollection;


    @Override
    public void init() {
        LOGGER.info("Initializing login servlet...");
        try {
            userCollection = DBProvider.getInstance().getUserCollection();
        } catch (MongoException ex) {
            LOGGER.error("Failed to create mongo connection: " + ex);
            destroy();
        }
    }

    @Override
    public void destroy() {
        LOGGER.info("Destroying login servlet...");
    }

    private void writeWebPage(
            HttpServletResponse resp,
            String username,
            String password,
            String message
    ) throws IOException {
        resp.setHeader("type", "text/html");
        PrintWriter writer = resp.getWriter();
        writer.print(webpage0);
        writer.print(message);
        writer.print(webpage1);
        writer.print(username);
        writer.print(webpage2);
        writer.print(password);
        writer.println(webpage3);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        HttpSession session = req.getSession();
        if (session.getAttribute("username") != null) {
            resp.sendRedirect("/game");
        } else {
            writeWebPage(resp, "", "", "");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        LOGGER.info("Processing login post request...");
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        User requested = userCollection.find(and(
                eq("username", username),
                eq("password", password)
        )).first();

        if (requested == null) {
            writeWebPage(
                    resp,
                    username,
                    password,
                    "Failed to log in!"
            );
        } else {
            HttpSession session = req.getSession();
            session.setAttribute("username", username);
            session.setAttribute("correct", 0);
            session.setAttribute("incorrect", 0);
            session.setAttribute("lastNumStr", "");
            resp.sendRedirect("/game");
        }
    }
}
