/*
 * Heim László
 * hlim1626
 * lab07
 */
package com.github.lasoloz.web.servlet;

import com.github.lasoloz.web.servlet.util.ResultItem;
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
import java.util.ArrayList;
import java.util.List;

@WebServlet(urlPatterns = "/game/result")
public class GameResultServlet extends HttpServlet {
    private static Logger LOGGER = LoggerFactory
            .getLogger(GameResultServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        if (req.getSession().getAttribute("username") == null) {
            resp.sendRedirect("/login.do");
            return;
        }

        try {
            HttpSession session = req.getSession();

            // Update values of current level:
            String level = (String) session.getAttribute("level");

            String correctAttrName = "";
            String incorrectAttrName = "";

            if (level.equals("1")) {
                correctAttrName = "correct_1";
                incorrectAttrName = "incorrect_1";
            } else if (level.equals("2")) {
                correctAttrName = "correct_2";
                incorrectAttrName = "incorrect_2";
            } else if (level.equals("3")) {
                correctAttrName = "correct_3";
                incorrectAttrName = "incorrect_3";
            }

            // Check correctness of number:
            String number = (String) session.getAttribute("number");
            String guess  = req.getParameter("client");

            int numberLen = number.length();
            int guessLen = guess.length();

            int comparableLen = Math.min(numberLen, guessLen);
            int bad = 0;

            List guessNumbers = new ArrayList();

            for (int i = 0; i < comparableLen; ++i) {
                char guessChar = guess.charAt(i);
                if (number.charAt(i) != guessChar) {
                    guessNumbers.add(new ResultItem(guessChar, true));
                    ++bad;
                } else {
                    guessNumbers.add(new ResultItem(guessChar, false));
                }
            }

            for (int i = numberLen; i < guessLen; ++i) {
                guessNumbers.add(new ResultItem(guess.charAt(i), true));
                ++bad;
            }


            // Update correct/incorrect count:
            if (bad == 0) {
                int val = (int) session.getAttribute(correctAttrName);
                session.setAttribute(correctAttrName, val + 1);
            } else {
                int val = (int) session.getAttribute(incorrectAttrName);
                session.setAttribute(incorrectAttrName, val + 1);
            }


            // Provide items for `jsp`:
            req.setAttribute("originalNumberStr", number);
            req.setAttribute("guessNumbers", guessNumbers);
            String percentageBase = "percentageLevel";
            String levelGuessesBase = "levelGuesses";
            String correctBase = "correct_";
            String incorrectBase = "incorrect_";
            for (int i = 1; i <= 3; ++i) {
                int correct = (int) session.getAttribute(correctBase + i);
                int incorrect = (int) session.getAttribute(incorrectBase + i);

                int total = correct + incorrect;
                float percentage = (float) correct / total * 100f;

                req.setAttribute(percentageBase + i, percentage);
                req.setAttribute(levelGuessesBase + i, total);
            }


            req.getRequestDispatcher("/gameResult.jsp").forward(req, resp);
//            // Ugly, but I don't care:
//            HttpSession session = req.getSession();
//            int correct = (int) session.getAttribute("correct");
//            int incorrect = (int) session.getAttribute("incorrect");
//            int time = (int) session.getAttribute("time");
//            int numCount = (int) session.getAttribute("numCount");
//            String lastNumStr = (String) session.getAttribute("lastNum");
//
//            resp.setHeader("type", "text/html");
//            PrintWriter out = resp.getWriter();
//
//            String clientAnswer = req.getParameter("client");
//
//            out.print(webpage0);
//            out.print(lastNumStr);
//            out.print(webpage1);
//
//            int lastNumLen = lastNumStr.length();
//            int clientAnswerLen = clientAnswer.length();
//            int comparableLen = Math.min(lastNumLen, clientAnswerLen);
//            int bad = 0;
//
//            for (int i = 0; i < comparableLen; ++i) {
//                char clientChar = clientAnswer.charAt(i);
//                if (lastNumStr.charAt(i) != clientChar) {
//                    out.print("<span>" + clientChar + "</span>");
//                    ++bad;
//                } else {
//                    out.print(clientChar);
//                }
//            }
//
//            for (int i = lastNumLen; i < clientAnswerLen; ++i) {
//                out.print("<span>" + clientAnswer.charAt(i) + "</span>");
//                ++bad;
//            }
//
//            float percent = (1f - ((float) bad / clientAnswerLen)) * 100f;
//
//            if (percent == 100f) {
//                ++correct;
//            } else {
//                ++incorrect;
//            }
//
//            ++numCount;
//            time = Math.max(time - 100, 2000);
//            session.setAttribute("time", time);
//            session.setAttribute("numCount", numCount);
//            session.setAttribute("correct", correct);
//            session.setAttribute("incorrect", incorrect);
//
//            out.print(webpage2);
//            out.print(percent + "%");
//            out.print(webpage3);
//            out.print(correct);
//            out.print(webpage4);
//            out.print(incorrect);
//            out.print(webpage5);
//            out.print("numCount=" + numCount + "&time=" + time);
//            out.print(webpage6);
        } catch (RuntimeException ex) {
            LOGGER.error("Invalid client result request: " + ex.getMessage());
            resp.getWriter().print("Runtime exception!");
            throw ex;
        }
    }
}
