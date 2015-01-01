package org.team1515.morscout;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;


public class FormActivity extends Activity {

    private String username;
    private String team;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_form);

        //Get data from intent
        Intent intent = getIntent();
        username = intent.getStringExtra("username");
        team = intent.getStringExtra("team");
        System.out.println("user " + username);
        System.out.println("team" + team);
        setTitle("Team " + team);
    }
}
