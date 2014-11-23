package org.team1515.client;

import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLConnection;

public class Sync extends AsyncTask<URL, Void, String>{
    @Override
    protected String doInBackground(URL... urls) {
        /*String message = "";
        try {
            URL url = urls[0];
            URLConnection urlConnection = url.openConnection();
            System.out.println("Opened connection");
            BufferedReader in = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            System.out.println("Passed buffer");
            String inputLine;

            while ((inputLine = in.readLine()) != null) {
                System.out.println("In loop");
                if (isCancelled()) {
                    break;
                }
                message += inputLine;
            }
            in.close();
        } catch (ConnectException e) {
            e.printStackTrace();
            message = "error";
        } catch (MalformedURLException e) {
            e.printStackTrace();
            message = "error";
        } catch (IOException e) {
            e.printStackTrace();
            message = "error";
        }

        System.out.println("Just before return");
        return message; */

        InputStream is = null;
        // Only display the first 500 characters of the retrieved
        // web page content.
        int len = 500;

        try {
            URL url = urls[0];
            System.out.println(url.getProtocol() + url.getHost() + url.getPort() + url.getPath());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(10000 /* milliseconds */);
            conn.setConnectTimeout(5000 /* milliseconds */);
            conn.setRequestMethod("GET");
            conn.setDoInput(true);
            // Starts the query
            conn.connect();
            int response = conn.getResponseCode();
            Log.d("Http Response", "The response is: " + response);
            is = conn.getInputStream();

            // Convert the InputStream into a string
            String contentAsString = readIt(is, len);
            return contentAsString;

            // Makes sure that the InputStream is closed after the app is
            // finished using it.
        } catch (ProtocolException e) {
            e.printStackTrace();
            return "error";
        } catch (IOException e) {
            e.printStackTrace();
            return "error";
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // Reads an InputStream and converts it to a String.
    public String readIt(InputStream stream, int len) throws IOException, UnsupportedEncodingException {
        Reader reader = null;
        reader = new InputStreamReader(stream, "UTF-8");
        char[] buffer = new char[len];
        reader.read(buffer);
        return new String(buffer);
    }
}
