package org.team1515.client;

import android.os.AsyncTask;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;

public class Sync extends AsyncTask<URL, Void, String>{
    @Override
    protected String doInBackground(URL... urls) {
        InputStream inputStream = null;
        // Only display the first 500 characters of the retrieved web page content.
        int length = 500;

        try {
            URL url = urls[0];

            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setReadTimeout(10000 /* milliseconds */);
            urlConnection.setConnectTimeout(5000 /* milliseconds */);
            urlConnection.setRequestMethod("GET");
            urlConnection.setDoInput(true);

            // Starts the query
            urlConnection.connect();
            int response = urlConnection.getResponseCode(); //generate http code
            Log.d("Http Response", "The response inputStream: " + response);
            inputStream = urlConnection.getInputStream();

            // Convert the InputStream into a string
            return readIt(inputStream, length);

        } catch (ProtocolException e) {
            e.printStackTrace();
            return "error";
        } catch (IOException e) {
            e.printStackTrace();
            return "error";
        } finally {
            if (inputStream != null) {
                try {
                    // Makes sure that the InputStream inputStream closed after the app inputStream
                    // finished using it.
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // Reads an InputStream and converts it to a String.
    public String readIt(InputStream stream, int len) throws IOException {
        Reader reader = new InputStreamReader(stream, "UTF-8");
        char[] buffer = new char[len];
        reader.read(buffer);
        return new String(buffer);
    }
}
