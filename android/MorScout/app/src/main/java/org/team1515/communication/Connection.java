package org.team1515.communication;

import android.os.AsyncTask;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;

public class Connection extends AsyncTask<URL, Void, String> {

    private static final int STREAM_LENGTH = 500;
    private List<NameValuePair> nameValuePairs;

    public Connection(List<NameValuePair> nameValuePairs) {
        this.nameValuePairs = nameValuePairs;
    }

    @Override
    protected String doInBackground(URL ... urls) {
        // Create a new HttpClient and Post Header, set timeout values
        HttpClient httpClient = new DefaultHttpClient();
        HttpParams httpParams = httpClient.getParams();
        HttpConnectionParams.setConnectionTimeout(httpParams, 3000);
        HttpConnectionParams.setConnectionTimeout(httpParams, 3000);
        HttpPost httppost;
        try {
            httppost = new HttpPost(urls[0].toURI());
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return "code=-1";
        }

        try {
            // Add data to Post request
            httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

            // Execute HTTP Post Request
            HttpResponse response = httpClient.execute(httppost);
            Reader reader = new InputStreamReader(response.getEntity().getContent(), "UTF-8");
            char[] buffer = new char[STREAM_LENGTH];
            reader.read(buffer);
            return new String(buffer);
        } catch (ClientProtocolException e) {
            e.printStackTrace();
            return "code=-1";
        } catch (IOException e) {
            e.printStackTrace();
            return "code=-1";
        }
    }
}
