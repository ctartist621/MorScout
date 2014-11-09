package org.team1515.morscout;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;


public class LoginActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }

    public void loginClick(View view) {
        EditText usernameText = (EditText)findViewById(R.id.usernameText);
        EditText passwordText = (EditText)findViewById(R.id.passwordText);
        String username = usernameText.getText().toString();
        String password = passwordText.getText().toString();
        if (username.equals("username") && password.equals("password")) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.putExtra("username", username);
            startActivity(intent);
        }
    }
}