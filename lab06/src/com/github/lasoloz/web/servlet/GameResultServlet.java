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
import java.text.ParseException;

@WebServlet(urlPatterns = "/game/result")
public class GameResultServlet extends HttpServlet {
    private static Logger LOGGER = LoggerFactory
            .getLogger(GameResultServlet.class);

    private static String webpage0 = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <title>Memory game results</title>\n" +
            "    <style>\n" +
            "        span {\n" +
            "            color: red;\n" +
            "        }\n" +
            "    </style>\n" +
            "</head>\n" +
            "<body>\n" +
            "    <h1>Results:</h1>\n" +
            "\n" +
            "    <h2>Original:</h2>\n" +
            "    <p><b>";
    private static String webpage1 = "</b></p>\n" +
            "    <h2>Result:</h2>\n" +
            "    <p>";
    private static String webpage2 = "</p>\n" +
            "    <p>Percentage:";
    private static String webpage3 = "</p>\n" +
            "    <p>Correct answers: ";
    private static String webpage4 = "</p>\n" +
            "    <p>Incorrect answers: ";
    private static String webpage5 = "</p>\n" +
            "    <button onclick=\"window.location.replace('/game?";
    private static String webpage6 = "');\">Next " +
            "level</button>\n" +
            "</body>\n" +
            "</html>";


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        if (req.getSession().getAttribute("username") == null) {
            resp.sendRedirect("/login.do");
        }

        try {
            // Ugly, but I don't care:
            HttpSession session = req.getSession();
            int correct = (int) session.getAttribute("correct");
            int incorrect = (int) session.getAttribute("incorrect");
            int time = (int) session.getAttribute("time");
            int numCount = (int) session.getAttribute("numCount");
            String lastNumStr = (String) session.getAttribute("lastNum");

            resp.setHeader("type", "text/html");
            PrintWriter out = resp.getWriter();

            String clientAnswer = req.getParameter("client");

            out.print(webpage0);
            out.print(lastNumStr);
            out.print(webpage1);

            int lastNumLen = lastNumStr.length();
            int clientAnswerLen = clientAnswer.length();
            int comparableLen = Math.min(lastNumLen, clientAnswerLen);
            int bad = 0;

            for (int i = 0; i < comparableLen; ++i) {
                char clientChar = clientAnswer.charAt(i);
                if (lastNumStr.charAt(i) != clientChar) {
                    out.print("<span>" + clientChar + "</span>");
                    ++bad;
                } else {
                    out.print(clientChar);
                }
            }

            for (int i = lastNumLen; i < clientAnswerLen; ++i) {
                out.print("<span>" + clientAnswer.charAt(i) + "</span>");
                ++bad;
            }

            float percent = (1f - ((float) bad / clientAnswerLen)) * 100f;

            if (percent == 100f) {
                ++correct;
            } else {
                ++incorrect;
            }

            ++numCount;
            time = Math.max(time - 100, 2000);
            session.setAttribute("time", time);
            session.setAttribute("numCount", numCount);
            session.setAttribute("correct", correct);
            session.setAttribute("incorrect", incorrect);

            out.print(webpage2);
            out.print(percent + "%");
            out.print(webpage3);
            out.print(correct);
            out.print(webpage4);
            out.print(incorrect);
            out.print(webpage5);
            out.print("numCount=" + numCount + "&time=" + time);
            out.print(webpage6);
        } catch (RuntimeException ex) {
            LOGGER.error("Invalid client result request!");
            resp.getWriter().print("Runtime exception:" + ex);
        }
    }
}
