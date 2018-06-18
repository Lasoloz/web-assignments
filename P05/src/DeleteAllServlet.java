import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;

@WebServlet(urlPatterns = "/deleteAll")
public class DeleteAllServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Deleting all...");
        HttpSession session = req.getSession();

        session.setAttribute("queries", new HashMap<String, Integer>());

        req.getRequestDispatcher("front.jsp").forward(req, resp);
    }
}
