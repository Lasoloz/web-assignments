import java.io.Serializable;

public class FootballPlayer implements Serializable{
    private String name;
    private int value;
    private int rating;
    private int id;

    private static int idCounter = 0;

    public FootballPlayer() {
        id = idCounter++;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public int getId() {
        return id;
    }
}
