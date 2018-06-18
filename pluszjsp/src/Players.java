
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;

@WebServlet(urlPatterns = "/")
public class Players extends HttpServlet {
    ArrayList<FootballPlayer> getPlayerList(HttpServletRequest req) {
        HttpSession session = req.getSession();

        ArrayList<FootballPlayer> players;
        try {
            players = (ArrayList<FootballPlayer>) session.getAttribute("players");

            if (players == null) {
                players = new ArrayList<>();
            }
        } catch (RuntimeException ex) {
            players = new ArrayList<>();
        }

        return players;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession();
        ArrayList<FootballPlayer> players = getPlayerList(req);

        String saleStr = req.getParameter("sale");

        if (!saleStr.equals("")) {
            try {
                int id = Integer.parseInt(saleStr);
                players.removeIf(footballPlayer -> footballPlayer.getId() == id);

                session.setAttribute("players", players);
            } catch (NumberFormatException ex) {
                System.err.println("Failed to parse deletable");
            }
        }

        int total = 0;
        double avgRating = 0.0;
        int count = 0;
        for (FootballPlayer player : players) {
            total += player.getValue();
            avgRating += player.getRating();
            ++count;
        }

        req.setAttribute("total", total);
        req.setAttribute("avgRating", avgRating / count);
        req.setAttribute("players", players);
        req.getRequestDispatcher("Players.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession();
        ArrayList<FootballPlayer> players = getPlayerList(req);

        String name;
        int value;
        int rating;
        try {
            name = req.getParameter("playerName");
            value = Integer.parseInt(req.getParameter("playerValue"));
            rating = Integer.parseInt(req.getParameter("playerRating"));

            if (rating < 1 || rating > 5) {
                throw new RuntimeException("The rating is too small!");
            }
        } catch (RuntimeException ex) {
            System.err.println("Failed to process post request: " + ex.getMessage());
            doGet(req, resp);
            return;
        }

        FootballPlayer player = new FootballPlayer();
        player.setName(name);
        player.setRating(rating);
        player.setValue(value);

        players.add(player);
        session.setAttribute("players", players);
        doGet(req, resp);
    }
}
