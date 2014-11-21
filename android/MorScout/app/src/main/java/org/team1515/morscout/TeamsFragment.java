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
import android.widget.TextView;

import org.team1515.data.Match;
import org.team1515.data.Report;
import org.team1515.data.Team;

import java.util.ArrayList;
import java.util.Date;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link TeamsFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link TeamsFragment#newInstance} factory method to
 * create an instance of this fragment.
 *
 */
public class TeamsFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    //Team data
    private ArrayList<Team> teams;
    private ArrayList<Integer> keys;
    private SparseArray<ArrayList<String>> children;

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TeamsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static TeamsFragment newInstance(String param1, String param2) {
        TeamsFragment fragment = new TeamsFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }
    public TeamsFragment() {
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

        View view = inflater.inflate(R.layout.fragment_teams, container, false);

        getTeamData();

        ExpandableListView listView = (ExpandableListView)view.findViewById(R.id.expandableListViewTeams);
        listView.setAdapter(new TeamListAdapter(view.getContext(), keys, children));

        // Inflate the layout for this fragment

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

    private void getTeamData() {
        teams = new ArrayList<Team>();

        //Test data
        ArrayList<Report> reports = new ArrayList<Report>();
        reports.add(new Report("First Author"));
        reports.add(new Report("Second Author"));
        teams.add(new Team(1515, "MorTorq", reports));
        teams.add(new Team(254, "Cheese", reports));
        teams.add(new Team(1717, "Pinguinos", reports));

        keys = new ArrayList<Integer>();
        children = new SparseArray<ArrayList<String>>();
        ArrayList<String> values;

        for(int i = 0; i < teams.size(); i++) {
            Team team = teams.get(i);
            keys.add(team.getNumber());
            values = new ArrayList<String>();
            values.add("Name: " + team.getName());
            for(Report report : team.getReports()) {
                values.add("Report: " + report.getAuthor());
            }
            children.put(team.getNumber(), values);
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
