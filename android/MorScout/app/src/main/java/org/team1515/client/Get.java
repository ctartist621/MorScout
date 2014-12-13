package org.team1515.client;

import android.os.AsyncTask;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URISyntaxException;
import java.net.URL;

public class Get extends AsyncTask<URL, Void, String> {

    private static final int STREAM_LENGTH = 500;

    @Override
    protected String doInBackground(URL... urls) {
        // Create a new HttpClient and Post Header
        HttpClient httpclient = new DefaultHttpClient();
        HttpGet httpGet;
        try {
            httpGet = new HttpGet(urls[0].toURI());
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return "URI Syntax Exception";
        }

        try {
            // Execute HTTP Post Request
            HttpResponse response = httpclient.execute(httpGet);
            return readInputStream(response.getEntity().getContent(), STREAM_LENGTH);
        } catch (IOException e) {
            e.printStackTrace();
            return "IO Exception";
        }
    }

    // Reads an InputStream and converts it to a String.
    public String readInputStream(InputStream stream, int len) throws IOException {
        Reader reader = new InputStreamReader(stream, "UTF-8");
        char[] buffer = new char[len];
        reader.read(buffer);
        return new String(buffer);
    }
}
