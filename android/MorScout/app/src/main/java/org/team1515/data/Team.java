package org.team1515.data;

import java.util.ArrayList;

public class Team {
    private int number;
    private String name;
    private ArrayList<Report> reports;

    public Team(int number, String name, ArrayList<Report> reports) {
        this.number = number;
        this.name = name;
        this.reports = reports;
    }

    public int getNumber() {
        return number;
    }

    public String getName() {
        return name;
    }

    public ArrayList<Report> getReports() {
        return reports;
    }
}
