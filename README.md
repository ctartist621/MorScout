#MorScout
*Team 1515 MorTorq FRC Scouting Application*

####Includes:
- [X] Server
- [X] Web Client
- [X] Android Client
- [X] iOS Client

##Getting Started
---
In order to run the MorScout server, you need to have the latest version of node.js installed on the computer you are planning to run your personal server. To install node.js, go to http://nodejs.org and click on install.

##How to Make an Account
---
Open the terminal or command prompt and navigate to the "server" folder and then enter the following line of code:
```sh
$ node --harmony userManager
```
now enter your desired username after the word "add". For example:
```sh
$ add YourUserNameHere
```
To add a password type changePass followed by your username and then your desired password.
```sh
$ changePass YourUserNameHere YourPasswordHere
```
Additionally you can type help if you are having trouble.
##How to Run
---
Open the terminal or command prompt and navigate to the "server" folder and then, enter this line of code:
```sh
$ node --harmony server
```
1.  Record the ip address address printed.
2.  Navigate to the "webapp" folder and open "index.html" in your favorite browser.
3.  If the server is running on the machine being used to open "index.html" skip the next step. 
4. Navigate to the settings page and enter the correct ip and port.
5. Now you can log in to your account from the navigation page and start scouting!
6. Remember to give Team 1515 your feedback. We would love to hear from you!!

##How to Set Regional
---
Each team will be running their own server, so it is completely customizable. You can set your regional by going to the "url.json" file in the server folder and changing two instances of "2014calb" to the desired year and event code. Your event code can be found at https://docs.google.com/spreadsheet/ccc?key=0ApRO2Yzh2z01dExFZEdieV9WdTJsZ25HSWI3VUxsWGc#gid=0.

Everytime you change the url to the regional or feel like the information on blue alliance has been updated please run the following commands when you are in the server folder from the terminal:
```sh
$ node --harmony getMatches
$ node --harmony getTeams
```

##How to Send Feedback to Team 1515
---
Sending feedback is simple! Because MorScout is still in beta we rely on your feedback to make the best scouting app ever!
Just simply navigate to the feedback page from any morscout page and submit your feedback. Then navigate to the server folder in the terminal or command prompt and type:
```sh
$ node --harmony sendFeedback
```
You are good to go!

##Support
---
For help do not hesitate to email me at rafezyfarbod@gmail.com

