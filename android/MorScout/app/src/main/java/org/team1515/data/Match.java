package org.team1515.data;

import java.util.ArrayList;
import java.util.Date;

public class Match {
    private int number;
    private Date date;
    private ArrayList<Report> reports;

    public Match(int number, Date time, ArrayList<Report> reports) {
        this.number = number;
        this.date = time;
        this.reports = reports;
    }

    public int getNumber() {
        return number;
    }

    public Date getDate() {
        return date;
    }

    public ArrayList<Report> getReports() {
        return reports;
    }
}
