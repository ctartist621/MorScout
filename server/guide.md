# Guide to the Server

---

## Before Competition

Make sure that the following files have the following contents:

* `data.json` - `{}`
* `users.json` - `{}`
* `feedback.json` - `[]`

### Downloading Team and Match Data

Before competition, you must fetch the appropriate team and match data from thebluealliance.com. 

1. First, find the path to your competition data and put it in `url.json`.
2. Run `node --harmony getTeams` and `node --harmony getMatches` to download the team and match data. This requires an internet connection.

Make sure each client syncs at least once before competition to receive the team and match data from the server.

### Setting up Users

Run `node --harmony userManager` to access the user manager. Type `help` to see a list of commands. Avoid holding down the enter key in the user manager.

* `list`  - lists all users
* `logoutAll` - logs out all users to clean up users.json
* `logout [username]` - logs out the specified user
* `add [username]` - adds the specified user
* `remove [username]` - removes the specified user
* `changePass [username]` - changes the specifed user's password
* `exit` - exits the user manager

If a user's name is `admin`, they will be able to add users away from the command line. It is recommended that you use `add admin` and `changePass admin password` to create an administrator account.

Note that passwords are not completely secure, as security is not the focus of MorScout. They are encrypted, but are stored in a plain text file. Because of this, use a different password for MorScout than you do for other things.

---

## During Competition

During competition, just run the server with `node --harmony server`. If you are connected to a wifi network when starting the server, it will tell you its local IP address. All login, logout, and sync events are logged on the server. You can end the server with `Ctrl + C` at any time.

### Connection Between Client and Server

It is recommended that you use either an ad hoc network or a hotspot to provide a way to connect client and server. If a client is not connected to the server, have no fear. They will still be able to record information and view information they previously received from the server. However, others will not be able to see what they have done and they will not be able to see what others have done until they connect to the server and sync. Before doing anything, each client must sync with the server at least once to receive team and match data. This can be done before competition.

### Backups

You never know what could happen. Every so often, create a copy of `data.json` and put it somewhere else on the server computer. If something were to happen to the file, reverting is as easy as copying the old `data.json` into the server folder. If you would like, you could also create a backup of `users.json` to save all account information.

---

## After Competition

Save `data.json` somewhere to have a record of your data in case you ever want it. If you ever want to look back at the data, copy the file back into a MorScout server folder and run the server. If you are in between regionals, you might want to preserve the contents of `users.json` so that you don't have to recreate accounts for your scouters.

### Sending Feedback

We at MorScout value your feedback. After all the scouting is done, look in `feedback.json`. If there is anything in there other than `[]`, it means someone has something to tell us. In that case, run `node --harmony sendFeedback` to email us the feedback. An internet connection is required.