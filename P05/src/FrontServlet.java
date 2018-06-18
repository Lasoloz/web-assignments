import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet(urlPatterns = "/")
public class FrontServlet extends HttpServlet {
    private void addCountry(String country, int money, HttpSession session) {
        System.out.println("Adding country...");
        HashMap<String, Integer> queries = (HashMap) session.getAttribute("queries");

        queries.put(country, money);
        session.setAttribute("queries", queries);
    }

    private void makeCountryRequests(HttpServletRequest req) {
        HttpSession session = req.getSession();
        HashMap<String, Integer> queries =
                (HashMap) session.getAttribute("queries");

        try {
            URLConnection connection =
                    new URL("http://www.fuel-prices-europe.info")
                            .openConnection();

            System.out.println("Attempting to read page...");

            BufferedReader reader = new BufferedReader(new InputStreamReader(
                    connection.getInputStream()
            ));

            StringBuilder page = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                page.append(line);
            }

            System.out.println("Attempting to find out fuel prices for " +
                    "all of your requests!");

            String pageStr = page.toString();

            ArrayList<FuelData> fuelDataList = new ArrayList<>();
            for (Map.Entry<String, Integer> entry : queries.entrySet()) {
                Pattern p = Pattern.compile("(" +
                        Pattern.quote(entry.getKey()) + ").{1,85}&euro; ([0-9]+,[0-9]+)");
                Matcher m = p.matcher(pageStr);


                if (m.find()) {
                    NumberFormat format = NumberFormat.getInstance(Locale.FRANCE);
                    Number number = format.parse(m.group(2));
                    float price = number.floatValue();

                    float money = (float) entry.getValue();

                    FuelData fuelData = new FuelData();
                    fuelData.setCountry(entry.getKey());
                    fuelData.setLitres(money / price);
                    fuelData.setMoney(entry.getValue());

                    fuelDataList.add(fuelData);
                }
            }

            req.setAttribute("fuelDataList", fuelDataList);
        } catch (IOException ex) {
            System.err.println("Failed to query fuel data: " + ex);
        } catch (ParseException ex) {
            System.err.println("Failed to parse fuel value: " + ex);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        System.out.println("Egy");
        HttpSession session = req.getSession();
        if (session.getAttribute("queries") == null) {
            session.setAttribute("queries", new HashMap<String, Integer>());
        }

        String country;
        int money;
        try {
            country = req.getParameter("country");
            money = Integer.parseInt(req.getParameter("money"));

            addCountry(country, money, session);
        } catch (RuntimeException ex) {
            System.out.println("No request, showing default page..." + ex);
        }

        try {
            makeCountryRequests(req);
        } catch (RuntimeException ex) {
            System.out.println("Price parse failed: " + ex);
        }

        req.getRequestDispatcher("front.jsp").forward(req, resp);
    }
}
