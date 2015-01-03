package org.team1515.communication;

import android.content.SharedPreferences;
import android.net.Uri;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class Sync extends Connection {
    public Sync() {
        try {
            url = new URL(protocol, host, port, "/sync");
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected Response doInBackground(SharedPreferences... preferences) {
        //Prepare post data
        String username = preferences[0].getString("username", "");
        String token = preferences[0].getString("token", "");
        String data = preferences[0].getString("data", "[]");
        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(3);
        nameValuePairs.add(new BasicNameValuePair("user", username));
        nameValuePairs.add(new BasicNameValuePair("token", token));
        nameValuePairs.add(new BasicNameValuePair("data", data));

        //Make sync connection
        Uri query  = Uri.parse("?" + connect(nameValuePairs));
        String code = query.getQueryParameter("code");

        //Code is 0 when sync successful
        if (code.equals("0")) {
            //Add match data to storage
            preferences[0].edit().putString("matches", query.getQueryParameter("matches")).apply();

            return Response.SYNC_SUCCESS;
        } else if (code.equals("1")) {
            return Response.SYNC_FAILED;
        } else if (code.equals("2")) {
            return Response.MALFORMED_REQUEST;
        } else {
            return Response.CONNECTION_FAILED;
        }
    }
}
