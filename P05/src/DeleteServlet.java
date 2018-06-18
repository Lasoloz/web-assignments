import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;

@WebServlet(urlPatterns = "/delete")
public class DeleteServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession();
        if (session.getAttribute("queries") == null) {
            session.setAttribute("queries", new HashMap<String, Integer>());
        }

        String which = req.getParameter("name");

        System.out.println("Deleting one: " + which);

        if (which != null) {
            HashMap<String, Integer> queries =
                    (HashMap) session.getAttribute("queries");

            queries.remove(which);

            session.setAttribute("queries", queries);
        }

        resp.sendRedirect("/");
    }
}
