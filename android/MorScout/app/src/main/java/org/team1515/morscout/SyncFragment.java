package org.team1515.morscout;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link SyncFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link SyncFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SyncFragment extends Fragment {

    private OnFragmentInteractionListener mListener;

    // TODO: Rename and change types and number of parameters
    public static SyncFragment newInstance(String param1, String param2) {
        return new SyncFragment();
    }

    public SyncFragment() {
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
        View view = inflater.inflate(R.layout.fragment_sync, container, false);

        //Restore text box data from previous storage
        EditText hostTextBox = (EditText)view.findViewById(R.id.hostnameTextbox);
        EditText portTextBox = (EditText)view.findViewById(R.id.portTextbox);
        EditText pathTextBox = (EditText)view.findViewById(R.id.pathTextbox);
        try {
            SharedPreferences preferences = getActivity().getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
            hostTextBox.setText(preferences.getString("host", ""));
            portTextBox.setText(preferences.getString("port", ""));
            pathTextBox.setText(preferences.getString("path", ""));
        } catch (Resources.NotFoundException e) {
            e.printStackTrace();
        }

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


    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        public void onFragmentInteraction(Uri uri);
    }

}
