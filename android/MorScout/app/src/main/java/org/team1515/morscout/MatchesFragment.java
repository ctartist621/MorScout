package org.team1515.morscout;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;

import org.team1515.client.Match;
import org.team1515.client.Report;

import java.util.ArrayList;
import java.util.Date;


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
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

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
        MatchesFragment fragment = new MatchesFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }
    public MatchesFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_matches, container, false);
        //Create interface for matches
        getMatchData();
        ExpandableListView listView = (ExpandableListView)view.findViewById(R.id.expandableListView);

        listView.setAdapter(new MatchListAdapter(view.getContext(), keys, children));

        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
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

        //Test data
        ArrayList<Report> reports = new ArrayList<Report>();
        reports.add(new Report("First Author"));
        reports.add(new Report("Second Author"));
        matches.add(new Match(1, new Date(2014, 11, 16), reports));
        matches.add(new Match(2, new Date(2014, 11, 17), reports));
        matches.add(new Match(3, new Date(2014, 11, 17), reports));
        matches.add(new Match(4, new Date(2014, 11, 17), reports));
        matches.add(new Match(5, new Date(2014, 11, 17), reports));
        matches.add(new Match(6, new Date(2014, 11, 17), reports));
        matches.add(new Match(7, new Date(2014, 11, 17), reports));
        matches.add(new Match(8, new Date(2014, 11, 17), reports));
        matches.add(new Match(9, new Date(2014, 11, 17), reports));
        matches.add(new Match(10, new Date(2014, 11, 17), reports));
        matches.add(new Match(11, new Date(2014, 11, 17), reports));
        matches.add(new Match(12, new Date(2014, 11, 17), reports));
        matches.add(new Match(13, new Date(2014, 11, 17), reports));
        matches.add(new Match(14, new Date(2014, 11, 17), reports));
        matches.add(new Match(15, new Date(2014, 11, 17), reports));
        matches.add(new Match(16, new Date(2014, 11, 17), reports));
        matches.add(new Match(17, new Date(2014, 11, 17), reports));
        matches.add(new Match(18, new Date(2014, 11, 17), reports));
        matches.add(new Match(19, new Date(2014, 11, 17), reports));
        matches.add(new Match(20, new Date(2014, 11, 17), reports));
        matches.add(new Match(21, new Date(2014, 11, 17), reports));
        matches.add(new Match(22, new Date(2014, 11, 17), reports));
        matches.add(new Match(23, new Date(2014, 11, 17), reports));
        matches.add(new Match(24, new Date(2014, 11, 17), reports));
        matches.add(new Match(25, new Date(2014, 11, 17), reports));
        matches.add(new Match(26, new Date(2014, 11, 17), reports));

        keys = new ArrayList<Integer>();
        children = new SparseArray<ArrayList<String>>();
        ArrayList<String> values;

        for(int i = 0; i < matches.size(); i++) {
            Match match = matches.get(i);
            keys.add(match.getNumber());
            values = new ArrayList<String>();
            values.add(match.getDate().toString());
            for(Report report : match.getReports()) {
                values.add("Report: " + report.getAuthor());
            }
            children.put(match.getNumber(), values);
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
