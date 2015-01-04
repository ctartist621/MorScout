package org.team1515.morscout;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;
import android.widget.Toast;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.team1515.communication.Config;
import org.team1515.communication.Match;
import org.team1515.communication.Connection;
import org.team1515.communication.Response;
import org.team1515.communication.Sync;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link MatchesFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link MatchesFragment#newInstance} factory method to
 * create an instance of this fragment.
 *
 */
public class MatchesFragment extends Fragment {
    private OnFragmentInteractionListener mListener;



    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment MatchesFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static MatchesFragment newInstance(String param1, String param2) {
        return new MatchesFragment();
    }
    public MatchesFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_matches, container, false);
        //Create ExpandableListView for matches
        getMatchData(view);


        return view;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mListener = (OnFragmentInteractionListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    //Retrieve all match data from JSON file
    private void getMatchData(View view) {
        //Match data
        ArrayList<Match> matches = new ArrayList<Match>();
        SparseArray<String> keys = new SparseArray<String>();
        SparseArray<List<NameValuePair>> children = new SparseArray<List<NameValuePair>>();

        //Grab data from storage
        SharedPreferences preferences = getActivity().getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
        String username = preferences.getString("username", "");
        String token = preferences.getString("token", "");

        //Add data to post request
        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
        nameValuePairs.add(new BasicNameValuePair("user", username));
        nameValuePairs.add(new BasicNameValuePair("token", token));
        nameValuePairs.add(new BasicNameValuePair("data", "[]"));

        Response response;
        String jsonData = "";
        try {
            //Get JSON from server
            response = new Sync(preferences).execute().get();
            System.out.println(response);
            if (response == Response.SYNC_SUCCESS) {
                //Grab sync data
                jsonData = preferences.getString("matches", "{}");
            } else {
                //Notify user of connection failure via a toast
                Toast.makeText(this.getActivity(), R.string.failed_to_connect, Toast.LENGTH_LONG).show();

                //Could not connect to server - grab data from storage
                jsonData = preferences.getString("matches", "");
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this.getActivity(), R.string.failed_to_connect, Toast.LENGTH_LONG).show();

            //Could not connect to server - grab data from storage
            jsonData = preferences.getString("matches", "");
        } finally {
            try {
                //Parse JSON
                JSONObject json = new JSONObject(jsonData);
                List<NameValuePair> values;
                for (int i = 0; i < json.length(); i++) {

                    JSONObject match = json.getJSONObject(Integer.toString(i + 1));
                    keys.put(i, "Match " + i + 1 + "\t\t" + match.getString("time"));

                    values = new ArrayList<NameValuePair>();
                    //Blue teams
                    JSONArray blueTeams = match.getJSONArray("blue");
                    for (int x = 0; x < 3; x++) {
                        values.add(new BasicNameValuePair("blue", Integer.toString(blueTeams.getInt(x))));
                    }
                    //Red teams
                    JSONArray redTeams = match.getJSONArray("red");
                    for (int x = 0; x < 3; x++) {
                        values.add(new BasicNameValuePair("red", Integer.toString(blueTeams.getInt(x))));
                    }
                    children.put(i, values);

                    //Create expandable list view
                    ExpandableListView expandableListView = (ExpandableListView)view.findViewById(R.id.expandableListView);
                    expandableListView.setAdapter(new MatchListAdapter(view.getContext(), keys, children));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        public void onFragmentInteraction(Uri uri);
    }

}
