/*
 * Heim László
 * hlim1626
 * lab07
 */
package com.github.lasoloz.web.servlet;

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
import java.util.Date;
import java.util.Random;

@WebServlet(urlPatterns = "/game")
public class GameServlet extends HttpServlet {
    private static Logger LOGGER = LoggerFactory.getLogger(GameServlet.class);
    private static Random rand = new Random(new Date().getTime());

    private static String webpage0 = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <title>Memory game</title>\n" +
            "</head>\n" +
            "<body>\n" +
            "<h1>Memory game:</h1>\n" +
            "<div id=\"game-number-to-guess\">";
    private static String webpage1 = "</div>\n" +
            "<div id=\"game-time-for-guess\">";
    private static String webpage2 = "</div>\n" +
            "<form id=\"game-form\" hidden>\n" +
            "    <input id=\"game-answer\" type=\"text\" name=\"game-answer\">\n" +
            "    <button id=\"answer-button\">Guess</button>\n" +
            "</form>\n" +
            "<script src=\"/game.js\"></script>\n" +
            "</body>\n" +
            "</html>";


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        if (req.getSession().getAttribute("username") == null) {
            LOGGER.info("No session!");
            resp.sendRedirect("/login.do");
            return;
        }

        int numCount = 3;
        int time = 6000;

        String level = req.getParameter("level");
        if (level != null) {
            if (level.equals("2")) {
                numCount = 5;
                time = 5000;
            } else if (level.equals("3")) {
                numCount = 8;
                time = 7000;
            }
        } else {
            level = "1";
        }


        PrintWriter out = resp.getWriter();
        StringBuilder numberStrBuilder = new StringBuilder("");
        for (int i = 0; i < numCount; ++i) {
            numberStrBuilder.append(rand.nextInt(10));
        }

        req.setAttribute("numberToGuess", numberStrBuilder.toString());
        req.setAttribute("timeForGuess", time);

        req.getSession().setAttribute("level", level);
        req.getSession().setAttribute("number", numberStrBuilder.toString());

        req.getRequestDispatcher("/game.jsp").forward(req, resp);
    }
}
