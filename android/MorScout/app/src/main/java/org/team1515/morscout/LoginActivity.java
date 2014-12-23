package org.team1515.morscout;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.team1515.communication.Post;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


public class LoginActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //TODO: If already logged in, bypass login screen
        SharedPreferences preferences = getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
        String token = preferences.getString("token", "");
        if (!token.equals("")) {
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
            String response = "";
            nameValuePairs.add(new BasicNameValuePair("token", token));
            try {
                response = new Post(nameValuePairs).execute(new URL("http", "192.168.1. 132", "/login")).get();
                Uri query = Uri.parse("?" + response);
                //TODO: finish
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
        String username = usernameText.getText().toString();
        String password = passwordText.getText().toString();

        //Send login POST to server
        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
        nameValuePairs.add(new BasicNameValuePair("username", username));
        nameValuePairs.add(new BasicNameValuePair("password", password));
        Post post = new Post(nameValuePairs);
        String response = "";
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
            AlertDialog.Builder alert = new AlertDialog.Builder(this);
            alert.setPositiveButton("OK", null);
            alert.setCancelable(false);
            alert.setMessage("Could not connect to server");
            alert.create().show();
        } else if (code.equals("0")) {
            //Get token
            String token = query.getQueryParameter("token");

            //Store user, pass, token
            SharedPreferences preferences = getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
            preferences.edit().putString("username", username).apply();
            preferences.edit().putString("password", password).apply();
            preferences.edit().putString("token", token).apply();

            //Start main activity/main app
            Intent intent = new Intent(this, MainActivity.class);
            intent.putExtra("username", username);
            startActivity(intent);
        } else { //If we can't log in, display alert signifying problem
            AlertDialog.Builder alert = new AlertDialog.Builder(this);
            alert.setPositiveButton("OK", null);
            alert.setCancelable(false);
            if (code.equals("1")) {
                alert.setMessage("Already logged in");
            } else if (code.equals("2") || code.equals("3") || code.equals("4")) {
                alert.setMessage("Username/password incorrect");
            }
            alert.create().show();
        }
    }
}