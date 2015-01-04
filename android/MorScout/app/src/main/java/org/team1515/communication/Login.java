package org.team1515.communication;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.team1515.morscout.LoginActivity;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class Login extends Connection {
    public Login(SharedPreferences preferences) {
        super(preferences);
        try {
            //Create url for login
            url = new URL(protocol, host, port, "/login");
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected Response doInBackground(Void... voids) {
        //Prepare post data
        String username = preferences.getString("username", "");
        String password = preferences.getString("password", "");
        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
        nameValuePairs.add(new BasicNameValuePair("user", username));
        nameValuePairs.add(new BasicNameValuePair("pass", password));

        //Make login connection
        Uri query  = Uri.parse("?" + connect(nameValuePairs));
        String code = query.getQueryParameter("code");

        //Code is 0 when login successful
        if (code.equals("0")) {
            //Add token to storage and mark user as logged in
            preferences.edit().putString("token", query.getQueryParameter("token")).apply();
            preferences.edit().putBoolean("isLoggedIn", true).apply();

            return Response.LOGIN_SUCESSS;
        } else if (code.equals("1")) {
            return Response.LOGIN_FAILED;
        } else if (code.equals("2")) {
            return Response.MALFORMED_REQUEST;
        } else {
            return Response.CONNECTION_FAILED;
        }
    }
}
