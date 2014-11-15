package org.team1515.morscout;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.widget.DrawerLayout;
import android.support.v4.app.FragmentManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


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

    @Override
    public void onFragmentInteraction(Uri uri) {

    }


}
