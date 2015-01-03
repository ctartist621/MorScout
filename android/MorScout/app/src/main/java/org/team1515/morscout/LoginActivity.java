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
import org.team1515.communication.Connection;
import org.team1515.communication.Login;
import org.team1515.communication.Logout;
import org.team1515.communication.Response;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


public class LoginActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //Attempt to log out of previous session
        try {
            //Make logout connection to server
            SharedPreferences preferences = getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
            boolean isLoggedIn = preferences.getBoolean("isLoggedIn", false);
            Response response = null;
            if (!isLoggedIn) {
                new Logout().execute(preferences).get();
            } else {
                //Attempt login
                response = new Login().execute(preferences).get();

                //Generate response based on code received
                if (response == Response.LOGIN_SUCESSS || response == Response.CONNECTION_FAILED) {
                    //Display welcome message, and start new activity once closed
                    displayMessage("Welcome, " + preferences.getString("username", "") + "!", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            //Start main activity/main app
                            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                            startActivity(intent);
                            finish();
                        }
                    });
                }
            }
        }catch(InterruptedException e){
            e.printStackTrace();
        }catch(ExecutionException e){
            e.printStackTrace();
        }
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }

    public void loginClick(View view) {
        //Attempt to log out of previous session
        try {
            //Make logout connection to server
            SharedPreferences preferences = getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
            Response response  = new Logout().execute(preferences).get();

            //Continue login if connection was successful
            if (response != Response.CONNECTION_FAILED) {
                //Grab user and pass from text boxes
                EditText usernameText = (EditText)findViewById(R.id.usernameText);
                EditText passwordText = (EditText)findViewById(R.id.passwordText);
                String username = usernameText.getText().toString();
                String password = passwordText.getText().toString();

                //Store username and password
                preferences.edit().putString("username", username).apply();
                preferences.edit().putString("password", password).apply();

                //Make login connection to server
                response = new Login().execute(preferences).get();

                //Generate response based on code received
                if (response == Response.LOGIN_SUCESSS) {
                    //Display welcome message, and start new activity once closed
                    displayMessage("Welcome, " + username + "!", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            //Start main activity/main app
                            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                            startActivity(intent);
                            finish();
                        }
                    });
                    //If we can't log in, display alert signifying problem
                } else if (response == Response.CONNECTION_FAILED) {
                    displayMessage("Could not connect to server");
                } else if (response == Response.LOGIN_FAILED) {
                    displayMessage("Username/password incorrect");
                }
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
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