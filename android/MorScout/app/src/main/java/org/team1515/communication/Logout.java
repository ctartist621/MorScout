package org.team1515.communication;

import android.content.SharedPreferences;
import android.net.Uri;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class Logout extends Connection{
    public Logout() {
        try {
            //Create url for login
            url = new URL(protocol, host, port, "/logout");
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected Response doInBackground(SharedPreferences... preferences) {
        //Prepare post data
        String token = preferences[0].getString("token", "");
        boolean isLoggedIn = preferences[0].getBoolean("isLoggedIn", false);
        if (!isLoggedIn && !token.equals("")) {
            String username = preferences[0].getString("username", "");
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
            nameValuePairs.add(new BasicNameValuePair("user", username));
            nameValuePairs.add(new BasicNameValuePair("token", token));

            //Make logout connection
            Uri query = Uri.parse("?" + connect(nameValuePairs));
            String code = query.getQueryParameter("code");

            //Code is 0 when logout successful
            preferences[0].edit().putString("password", "").apply();
            if (code.equals("0")) {
                //Remove user data from storage
                preferences[0].edit().putString("token", "").apply();

                return Response.LOGOUT_SUCCESS;
            } else if (code.equals("1")) {
                //Remove user data from storage
                preferences[0].edit().putString("token", "").apply();
                preferences[0].edit().putString("toLogout", "").apply();

                return Response.LOGOUT_FAILED;
            } else if (code.equals("2")) {
                return Response.MALFORMED_REQUEST;
            } else {
                preferences[0].edit().putString("toLogout", preferences[0].getString("token", "")).apply();
                preferences[0].edit().putString("token", "").apply();
                return Response.CONNECTION_FAILED;
            }
        }
        return Response.LOGOUT_SUCCESS;
    }
}
