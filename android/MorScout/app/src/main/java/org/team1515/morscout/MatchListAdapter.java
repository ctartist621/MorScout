package org.team1515.morscout;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Typeface;
import android.util.SparseArray;
import android.util.SparseIntArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.TextView;

import org.apache.http.NameValuePair;

public class MatchListAdapter extends BaseExpandableListAdapter {

    private Context context;
    private SparseArray<String> keys; // header titles
    private SparseArray<List<NameValuePair>> children;

    public MatchListAdapter(Context context, SparseArray<String> keys, SparseArray<List<NameValuePair>> children) {
        this.context = context;
        this.keys = keys;
        this.children = children;
    }

    @Override
    public Object getChild(int groupPosition, int childPosititon) {
        return children.get(groupPosition).get(childPosititon);
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    @Override
    public View getChildView(int groupPosition, final int childPosition,
                             boolean isLastChild, View convertView, ViewGroup parent) {

        final NameValuePair child = (NameValuePair)getChild(groupPosition, childPosition);
        final String childText = "Team " + child.getValue();

        if (convertView == null) {
            LayoutInflater infalInflater = (LayoutInflater) this.context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = infalInflater.inflate(R.layout.list_item, null);
        }

        TextView txtListChild = (TextView) convertView
                .findViewById(R.id.lblListItem);


        txtListChild.setText(childText);

    //Set text color based on team alliance
    if (child.getName().equals("red")) {
        txtListChild.setTextColor(Color.RED);
    } else if (child.getName().equals("blue")) {
        txtListChild.setTextColor(Color.BLUE);
    }

    txtListChild.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            SharedPreferences preferences = context.getSharedPreferences("org.team1515.morscout", Context.MODE_PRIVATE);
            String username = preferences.getString("username", "unknown");
            Intent intent = new Intent(context, FormActivity.class);
            intent.putExtra("username", username);
            intent.putExtra("team", child.getValue());
            context.startActivity(intent);
        }
    });

    return convertView;
}

    @Override
    public int getChildrenCount(int groupPosition) {
        return children.get(groupPosition).size();
    }

    @Override
    public Object getGroup(int groupPosition) {
        return this.keys.get(groupPosition);
    }

    @Override
    public int getGroupCount() {
        return this.keys.size();
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public View getGroupView(int groupPosition, boolean isExpanded,
                             View convertView, ViewGroup parent) {
        String headerTitle = getGroup(groupPosition).toString();
        if (convertView == null) {
            LayoutInflater inflater = (LayoutInflater) this.context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.list_group, null);
        }

        TextView lblListHeader = (TextView) convertView
                .findViewById(R.id.lblListHeader);
        lblListHeader.setTypeface(null, Typeface.BOLD);
        lblListHeader.setText(headerTitle);

        return convertView;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }
}