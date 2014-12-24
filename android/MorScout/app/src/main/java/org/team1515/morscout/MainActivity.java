package org.team1515.morscout;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.widget.DrawerLayout;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.team1515.communication.Post;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


public class MainActivity extends FragmentActivity
        implements NavigationDrawerFragment.NavigationDrawerCallbacks, TeamsFragment.OnFragmentInteractionListener, MatchesFragment.OnFragmentInteractionListener, SyncFragment.OnFragmentInteractionListener {

    //Fragment managing the behaviors, interactions and presentation of the navigation drawer.
    private NavigationDrawerFragment mNavigationDrawerFragment;

    //Data received from server after logging in
    private String token;
    private String username;
    private String password;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mNavigationDrawerFragment=(NavigationDrawerFragment)
                getFragmentManager().findFragmentById(R.id.navigation_drawer);

        // Set up the drawer.
        mNavigationDrawerFragment.setUp(R.id.navigation_drawer, (DrawerLayout)findViewById(R.id.drawer_layout));

        //Grab user data from storage
        SharedPreferences sharedPreferences = getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
        token = sharedPreferences.getString("token", "");
        username = sharedPreferences.getString("username", "");
        password = sharedPreferences.getString("password", "");

        //Display welcome message
        Intent intent = getIntent();
        AlertDialog.Builder alert = new AlertDialog.Builder(this);
        alert.setMessage("Welcome, " + intent.getStringExtra("username") + "!");
        alert.setPositiveButton("OK", null);
        alert.setCancelable(false);
        alert.create().show();
    }

    @Override
    public void onNavigationDrawerItemSelected(int position) {
        System.out.println(position);
        Fragment fragment;

        //Select correct fragment based on item selected
        switch (position) {
            case 0:
                fragment = new MatchesFragment();
                setTitle(R.string.title_fragment_matches);
                break;
            case 1:
                fragment = new TeamsFragment();
                setTitle(R.string.title_fragment_teams);
                break;
            case 2:
                fragment = new SyncFragment();
                setTitle(R.string.title_fragment_sync);
                break;
            case 3:
                logout();
                return;
            default:
                fragment = new MatchesFragment();
                setTitle(R.string.title_fragment_matches);
        }

        //Update the main content by replacing fragments
        FragmentManager fragmentManager = getSupportFragmentManager();
        fragmentManager.beginTransaction()
                .replace(R.id.container, fragment)
                .commit();
    }

    public void syncButton(View view) {
        //Text boxes from fragment
        EditText hostTextBox = (EditText)findViewById(R.id.hostnameTextbox);
        EditText portTextBox = (EditText)findViewById(R.id.portTextbox);
        EditText pathTextBox = (EditText)findViewById(R.id.pathTextbox);

        //Get hostname, port, and path
        String host = hostTextBox.getText().toString();
        String path = pathTextBox.getText().toString();
        int port;
        try {
            port = Integer.parseInt(portTextBox.getText().toString());
        } catch (NumberFormatException e) {
            e.printStackTrace();
            port = 0;
        }

        //Send Post request to server
        String response = "";
        try {
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
            nameValuePairs.add(new BasicNameValuePair("username", "BenH"));
            nameValuePairs.add(new BasicNameValuePair("password", "pigeon"));
            response = new Post(nameValuePairs).execute(new URL("http", host, port, path)).get();
        } catch (MalformedURLException e) {
            e.printStackTrace();
            response = "error";
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        //Set textview to display reponse from server
        TextView reponseTextView = (TextView)findViewById(R.id.responseTextView);
        reponseTextView.setText(response);

        //Get token from querystring
        Uri query = Uri.parse("?" + response);
        String code = query.getQueryParameter("code").trim();
        if(code.equals("0")) {
            token = query.getQueryParameter("token").trim();
            System.out.println("Logged in");
        } else if (code.equals("1")) {
            System.out.println("Already logged in");
        }


        //Store values in storage for later use
        SharedPreferences preferences = this.getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
        preferences.edit().putString("host", host).apply();
        preferences.edit().putString("port", Integer.toString(port)).apply();
        preferences.edit().putString("path", path).apply();
    }

    public void logout() {
        try {
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
            nameValuePairs.add(new BasicNameValuePair("username", username));
            nameValuePairs.add(new BasicNameValuePair("password", password));
            String response = new Post(nameValuePairs).execute(new URL("http", "192.168.1.132", 8080, "logout")).get().trim();
            if (response.equals("success")) {
                AlertDialog.Builder alert = new AlertDialog.Builder(this);
                alert.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        try {
                            finish();
                        } catch (Throwable throwable) {
                            throwable.printStackTrace();
                        }
                    }
                });
                alert.setCancelable(false);
                alert.setMessage("Logged out");
                alert.create().show();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }

    private void logoutListener() {

    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }


}
