package org.team1515.morscout;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.team1515.communication.Config;
import org.team1515.communication.Post;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


public class LoginActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //If already logged in, bypausernamess login screen

        //Retrieve user and pass from storage
        SharedPreferences preferences = getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
        String username = preferences.getString("username", "");
        String password = preferences.getString("password", "");

        if (!username.equals("") && !password.equals("")) {
            //Set up Post parameters
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
            nameValuePairs.add(new BasicNameValuePair("user", username));
            nameValuePairs.add(new BasicNameValuePair("pass", password));

            String response;
            try {
                response = new Post(nameValuePairs).execute(new URL(Config.protocol, Config.host, Config.port, "/login")).get().trim();
                Uri query = Uri.parse("?" + response);
                String code = query.getQueryParameter("code");
                if (code.equals("0")) {
                    //Store token
                    String token = query.getQueryParameter("token");
                    preferences.edit().putString("token", token).apply();

                    //Start main activity/main app
                    Intent intent = new Intent(this, MainActivity.class);
                    intent.putExtra("username", username);
                    startActivity(intent);
                    finish();
                }
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }

    public void loginClick(View view) {
        //Grab user and pass from text boxes
        EditText usernameText = (EditText)findViewById(R.id.usernameText);
        EditText passwordText = (EditText)findViewById(R.id.passwordText);
        final String username = usernameText.getText().toString();
        String password = passwordText.getText().toString();

        //Send login POST to server
        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
        nameValuePairs.add(new BasicNameValuePair("user", username));
        nameValuePairs.add(new BasicNameValuePair("pass", password));
        String response;
        try {
            response = new Post(nameValuePairs).execute(new URL("http", "192.168.1.132", 8080, "/login")).get();
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return;
        } catch (InterruptedException e) {
            e.printStackTrace();
            return;
        } catch (ExecutionException e) {
            e.printStackTrace();
            return;
        }

        //Parse response
        Uri query = Uri.parse("?" + response);
        String code = query.getQueryParameter("code").trim();

        //Generate response based on code received
        if (code.equals("-1")) {
            displayMessage("Could not connect to server");
        } else if (code.equals("0")) {
            //Get token
            String token = query.getQueryParameter("token").trim();

            //Store user, pass, token
            SharedPreferences preferences = getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
            preferences.edit().putString("username", username).apply();
            preferences.edit().putString("password", password).apply();
            preferences.edit().putString("token", token).apply();

            //Display welcome message, and start new activity once closed
            displayMessage("Welcome, " + username + "!", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    //Start main activity/main app
                    Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                    intent.putExtra("username", username);
                    startActivity(intent);
                    finish();
                }
            });
        } else { //If we can't log in, display alert signifying problem
            displayMessage("Username/password incorrect");
        }
    }

    private void displayMessage(String message) {
        AlertDialog.Builder alert = new AlertDialog.Builder(this);
        alert.setMessage(message);
        alert.setPositiveButton("OK", null);
        alert.setCancelable(false);
        alert.create().show();
    }

    private void displayMessage(String message, DialogInterface.OnClickListener listener) {
        AlertDialog.Builder alert = new AlertDialog.Builder(this);
        alert.setMessage(message);
        alert.setPositiveButton("OK", listener);
        alert.setCancelable(false);
        alert.create().show();
    }
}