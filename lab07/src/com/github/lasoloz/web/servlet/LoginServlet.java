/*
 * Heim László
 * hlim1626
 * lab07
 */
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

@WebServlet(urlPatterns = "/login.do")
public class LoginServlet extends HttpServlet {
    private static Logger LOGGER = LoggerFactory.getLogger(LoginServlet.class);

    private MongoCollection<User> userCollection;


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

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        HttpSession session = req.getSession();
        if (session.getAttribute("username") != null) {
            resp.sendRedirect("/game");
        } else {
            req.getRequestDispatcher("/login.jsp").forward(req, resp);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        LOGGER.info("Processing invalid login");
        req.getRequestDispatcher("/login.jsp").forward(req, resp);
    }
}
