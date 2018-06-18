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
            resp.sendRedirect("/login.do");
        }

        String timeStr = req.getParameter("time");
        String numCountStr = req.getParameter("numCount");

        int time = 6000;
        int numCount = 1;

        try {
            time = Integer.parseInt(timeStr);
            numCount = Integer.parseInt(numCountStr);
        } catch (NumberFormatException ex) {
            LOGGER.info("Client sent invalid number!");
        }

        resp.setHeader("type", "text/html");

        PrintWriter out = resp.getWriter();
        String numStr = "";
        out.print(webpage0);
        // Print a random string of number to guess:
        for (int i = 0; i < numCount; ++i) {
            numStr += Integer.toString(rand.nextInt(10));
        }
        out.print(numStr);
        out.print(webpage1);
        out.print("Time remaining to memorize the number: " +
                Math.abs(time) +
                "ms"
        );
        out.println(webpage2);


        // Save old data:
        HttpSession session = req.getSession();
        session.setAttribute("lastNum", numStr);
        session.setAttribute("time", time);
        session.setAttribute("numCount", numCount);
    }
}
