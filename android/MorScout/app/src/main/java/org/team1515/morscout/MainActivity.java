package org.team1515.morscout;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.widget.DrawerLayout;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import org.team1515.client.Sync;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.ExecutionException;


public class MainActivity extends FragmentActivity
        implements NavigationDrawerFragment.NavigationDrawerCallbacks, TeamsFragment.OnFragmentInteractionListener, MatchesFragment.OnFragmentInteractionListener, SyncFragment.OnFragmentInteractionListener {

    //Fragment managing the behaviors, interactions and presentation of the navigation drawer.
    private NavigationDrawerFragment mNavigationDrawerFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


    mNavigationDrawerFragment=(NavigationDrawerFragment)

    getFragmentManager().findFragmentById(R.id.navigation_drawer);

        // Set up the drawer.
    mNavigationDrawerFragment.setUp(R.id.navigation_drawer, (DrawerLayout)findViewById(R.id.drawer_layout));
    }

    @Override
    public void onNavigationDrawerItemSelected(int position) {
        System.out.println(position);
        Fragment fragment;

        //Select correct fragment based on item selected
        switch (position) {
            case 0:
                fragment = new MatchesFragment();
                setTitle(R.string.title_fragment_matches);
                break;
            case 1:
                fragment = new TeamsFragment();
                setTitle(R.string.title_fragment_teams);
                break;
            case 2:
                fragment = new SyncFragment();
                setTitle(R.string.title_fragment_sync);
                break;
            default:
                fragment = new MatchesFragment();
                setTitle(R.string.title_fragment_matches);
        }

        // update the main content by replacing fragments
        FragmentManager fragmentManager = getSupportFragmentManager();
        fragmentManager.beginTransaction()
                .replace(R.id.container, fragment)
                .commit();
    }


    public void onSectionAttached(int number) {
        switch (number) {
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    public void syncButton(View view) {
        EditText hostTextBox = (EditText)findViewById(R.id.hostnameTextbox);
        EditText portTextBox = (EditText)findViewById(R.id.portTextbox);
        EditText pathTextBox = (EditText)findViewById(R.id.pathTextbox);
        String host = hostTextBox.getText().toString();
        int port;
        try {
            port = Integer.parseInt(portTextBox.getText().toString());
        } catch (NumberFormatException e) {
            e.printStackTrace();
            port = 0;
        }
        String path = pathTextBox.getText().toString();

        String response = "";
        try {
            response = new Sync().execute(new URL("http", host, port, path)).get();
        } catch (MalformedURLException e) {
            e.printStackTrace();
            response = "error";
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        TextView reponseTextView = (TextView)findViewById(R.id.responseTextView);
        reponseTextView.setText(response);
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }


}
