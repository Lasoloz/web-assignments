/*
 * Heim László
 * hlim1626
 * lab07
 */
package com.github.lasoloz.web.servlet.filter;

import com.github.lasoloz.web.servlet.dao.DBProvider;
import com.github.lasoloz.web.servlet.dao.User;
import com.mongodb.MongoException;
import com.mongodb.client.MongoCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

@WebFilter(
        filterName = "loginFilter",
//        initParams = @WebInitParam(name = "username", value = "username"),
        urlPatterns = {"/login.do"}
)
public class LoginFilter implements Filter {
    private static Logger LOGGER = LoggerFactory.getLogger(LoginFilter.class);

    private MongoCollection<User> userCollection;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        LOGGER.info("Initializing login filter...");
        try {
            userCollection = DBProvider.getInstance().getUserCollection();
        } catch (MongoException ex) {
            LOGGER.error("Failed to create mongo collection: " + ex);
            destroy();
        }
    }

    @Override
    public void doFilter(
            ServletRequest servletRequest,
            ServletResponse servletResponse,
            FilterChain filterChain
    ) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpSession session = request.getSession();

        String username = (String) session.getAttribute("username");

        if (request.getMethod().equals("POST")) {
            LOGGER.info("Filtering login POST...");

            String clientUsername = request.getParameter("username");
            String clientPassword = request.getParameter("password");

            User requested = userCollection.find(and(
                    eq("username", clientUsername),
                    eq("password", clientPassword)
            )).first();

            if (requested == null) {
                LOGGER.info("User not found in database!");
                request.setAttribute("username", clientUsername);
                request.setAttribute("password", clientPassword);
                request.setAttribute("message", "Failed to log in!");
                filterChain.doFilter(request, servletResponse);
            } else {
                LOGGER.info("Setting session variables...");
                session.setAttribute("username", clientUsername);
                session.setAttribute("correct_1", 0);
                session.setAttribute("incorrect_1", 0);
                session.setAttribute("correct_2", 0);
                session.setAttribute("incorrect_2", 0);
                session.setAttribute("correct_3", 0);
                session.setAttribute("incorrect_3", 0);
                session.setAttribute("level", "1");
                response.sendRedirect("/game");
            }
        } else {
            if (username != null) {
                response.sendRedirect("/game");
            } else {
                filterChain.doFilter(servletRequest, servletResponse);
            }
        }
    }
}
