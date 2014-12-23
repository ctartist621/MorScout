package org.team1515.communication;

import android.text.format.Time;

import java.util.ArrayList;

public class Match {
    private int number;
    private Time time;
    private ArrayList<Team> teams;

    public Match(int number, ArrayList<Team> teams, Time time) {
        this.number = number;
        this.time = time;
        this.teams = teams;
    }

    public int getNumber() {
        return number;
    }

    public Time getTime() {
        return time;
    }

    public ArrayList<Team> getTeams() {
        return teams;
    }
}
