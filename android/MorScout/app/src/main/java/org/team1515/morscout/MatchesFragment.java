package org.team1515.morscout;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.text.format.Time;
import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.team1515.communication.Get;
import org.team1515.communication.Match;
import org.team1515.communication.Report;
import org.team1515.communication.Team;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.concurrent.ExecutionException;


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

    //Match data
    private ArrayList<Match> matches;
    private ArrayList<Integer> keys;
    private SparseArray<ArrayList<String>> children;

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
        getMatchData();
        ExpandableListView expandableListView = (ExpandableListView)view.findViewById(R.id.expandableListView);

        expandableListView.setAdapter(new MatchListAdapter(view.getContext(), keys, children));

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
    //TODO: incorporate JSON
    private void getMatchData() {
        matches = new ArrayList<Match>();

        //Pull data from server and add to list view
        String response = "";
        try {
            //Get JSON from server
            response = new Get().execute(new URL("http", "192.168.1.101", 8080, "/allMatches")).get().trim();

            //Values for expandable list view
            keys = new ArrayList<Integer>();
            children = new SparseArray<ArrayList<String>>();

            //Parse JSON
            JSONObject json = new JSONObject(response).getJSONObject("data");
            ArrayList<String> values;
            for(int i = 1; i <= json.length(); i++) {
                keys.add(i);
                JSONObject match = json.getJSONObject(Integer.toString(i));
                values = new ArrayList<String>();
                values.add(match.getString("time"));
                //Blue teams
                JSONArray blueTeams = match.getJSONArray("blue");
                for(int x = 0; x < 3; x++) {
                    values.add("Team " + blueTeams.getInt(x));
                }
                JSONArray redTeams = match.getJSONArray("red");
                for(int x = 0; x < 3; x++) {
                    values.add("Team " + redTeams.getInt(x));
                }
                children.put(i, values);
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
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
