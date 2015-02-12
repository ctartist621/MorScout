#MorScout
*Team 1515 MorTorq FRC Scouting Application*

####Includes:
- [X] Server
- [X] Web Client
- [X] Android Client
- [X] iOS Client

##How to Make an Account
---
Open the terminal or command prompt and navigate to the "server" folder and then enter the following line of code:
```sh
$ node userManager
```
now enter your desired username after the word "add". For example:
```sh
$ add YourUserNameHere
```
To add a password type changePass followed by your username and then your desired password. *Note that MorScout is currently in Beta and does not encrypt passwords.*
```sh
$ changePass YourUserNameHere YourPasswordHere
```
Additionally you can type help if you are having trouble.
##How to Run
---
Open the terminal or command prompt and navigate to the "server" folder and then, enter this line of code:
```sh
$ node server
```
1.  Record the ip address address printed.
2.  Navigate to the "webapp" folder and open "index.html" in your favorite browser.
3.  If the server is running on the machine being used to open "index.html" skip the next step. 
4. Navigate to the settings page and enter the correct ip and port.
5. Now you can log in to your account from the navigation page and start scouting!
6. Remember to give Team 1515 your feedback. We would love to hear from you!!

##How to set regional
---
Each team will be running their own server, so it is completely customizable. You can set your regional by going to the "url.json" file in the server folder and changing "2014calb" to the desired year and reginal code. Your regional code can be found on bluealliance.com.

##How to send feedback to team 1515
---
Sending feedback is simple! Because MorScout is still in beta we rely on your feedback to make the best scouting app ever!
Just simply navigate to the feedback page from any morscout page and submit your feedback. Then navigate to the server folder in the terminal or command prompt and type:
```sh
$ node sendFeedback
```
You are good to go!
