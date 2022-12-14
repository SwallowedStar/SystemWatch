# SystemWatch

---
## Summary

- [Description](#description)
- [Technologies & Dependencies](#technologies--dependencies)
- [How to install](#installing)
- [Testing fonctionnalities](#)
- [How to use](#how-to-use)
- [Remaining Bugs](#remaining-bugs)
- [Special thanks](#special-thanks)

---
## Description

This tool will let you monitor the status of your Server from anywhere.

Using sockets, a RestAPI and some Python libraries, you will be able to monitor your system remotly on a Dashboard. 
We strongly advide you to use this product in a closed network, as it has not been secured : the data going through the API and the sockets are uncrypted.

---
## Technologies & Dependencies

This software can be separated in 3 parts : 
- The scrapping part : a python script scraps all the data needed and sends it to the API
- The Rest API is made using nodejs. it gets all the infos from the computers it needs to monitor.
- The Front-end is also made with nodejs and expressjs. We didn't feel like doing a lot of CSS, so we just got some CSS from Bootstrap.

--- 
## Installing

We will be refering to different party by this vocabular : 
- *NodeServer* : This is the machine that will have the database as well as the Node Backend and Frontend
- *MonitorMachine* : This is the machine that will have the Python monitoring script 

### NodeServer Setup
#### Mysql DB Installation 

If you don't have mysql installed on your server, I'd advise you to install it using docker.

To do so, download the image : 
```
docker pull mysql
```

Then create an instance and set the MYSQL_ROOT_PASSWORD:
```
sudo docker run --name <INSTANCE NAME> -e MYSQL_ROOT_PASSWORD=<MYSQL ROOT USER PASSWORD> -p <PORT>:<PORT> -d mysql:latest
```
The port here is usually 3306.

Once you've done that, you can import the database into mysql.
There is the SQL creation script in the `database/system_watch_database.sql` file.
```
sudo docker exec -i <INSTANCE NAME> mysql -uroot -p<MYSQL ROOT USER PASSWORD> < database/system_watch_db.sql
```


#### Application Installation

At first, you need to download all the dependencies to the node projet.
```
cd nodejs
npm install
```

You'll then need to setup your environment variables.
To do so, create a `.env` file in the nodejs folder with the folowing infos :
- **LISTEN_PORT** : the listening port for expressjs
- **DB_HOST** : where the database will be intalled
- **DB_PORT** : The database used to access the database
- **DB_USER** : The user that will be able to access the database
- **DB_PASSWORD** : The user password
- **DB_NAME** : The name of the database you'll be using. By default, the created database is "system_watch_db". 
- **SOCKET_HOST** : This is where the API and socket server is installed. This shouldn't be "127.0.0.1" except if you're monitoring your own computer. It will be used by the front end to receive data to the server

A default file would look like this : 
```
LISTEN_PORT = 3000
DB_HOST = "127.0.0.1"
DB_PORT = 3306
DB_USER = "root"
DB_PASSWORD = <password>
DB_NAME = "system_watch_db"
SOCKET_HOST = "127.0.0.1"
```

Once all of that is done, you should see if the build passes the tests : 
```
cd nodejs
npm run test
```

It passes only if all the tests at the end show `true`.

To launch the server and test it with the python scrapper, you can use : 
```
npm run dev
```

Once this step is done, you have to setup the machine monitor.

### Machine Monitor Setup

Everything linked to this part of the project is in the folder named *scrap*.
This part of the project has been tested on Linux. Adaptations have been made for Windows machines, but it might not work as expected.
#### Install dependencies 

First of all, we created this using Python version 3.10.6.

You can find all the libraries used for the scrapping in the requirements.txt file located in the scrap folder. 

To install dependencies, you need to use the command : 
```
pip3 install -r scrap/requirements.txt
```

#### Configure API access

For this program to run, you'll need to define the environment variables.
To do so you also need to create a *.env* file in the scrap folder with the following informations : 
- **LISTEN_PORT** : the port to access the API
- **IP_HOST** : the IP of the computer hosting the API

A basic file will look like this : 

```
LISTEN_PORT = 3000
IP_HOST = "127.0.0.1"
```

---
## How to test the code 

You might want to test the code before launching it. \
You have 2 tools at you disposale : 
- Integrated testing in the npm app
- Postman configurations to test the api.

### Integrated testing in the npm app
If you want to use the tool embaded in the app, you can do this :
```
npm run test
```

It passes only if all the tests at the end show `true`.

### Postman configurations to test the api
The file `systemWatchAPITest.postman_collection.json` contains all the configurations to launch API calls from postman. \
Please execute them in the same order.
Be sure to read the documentation in the postman requests. 

--- 
## How to use

If you didn't read the setup instruction, you need to [go back](#installing). These are important steps.

The first thing you need to do is launch the nodejs backend. \
You can do it with these commands:

```
cd nodejs
npm run dev
```

Then launch the python scraper in admin mode if you are on windows: 
```
python3 scrap/scrap.py
```

Then in the webbrowser of your choice and type in the adress of the backend server. \
For example, it can be : http://localhost:3000/

This app is composed of 4 different screens : \

### Computer selection : 

On the first screen, you can select wich PC you wish to monitor.

![Computer selection screen](ressources/screen1.png)

### Live stream dashboard

On the live stream dashboard, you'll see 3 main graphs by default : 
- CPU Usage in %
- CPU Temperature in degree Celcius
- RAM Usage

![Live stream dashboard image](ressources/current_activity.png)

If we look at the options on the left, we can see that we can enable / disable some graphs. It can help visualize the informations we want to see.

![A close up image of the options](ressources/options.png)

We can also change the way the CPU Temperature is displayed. Here is the result if we turn on the "Display temperature for each core":

![A Linechart of the core temperatures](ressources/core_temperatures.png)

You also have the possibility to change the size and placement of the charts by doing drag&drop on the chart titles.

![Dashboard with the Core Temperatures in first and resized charts](ressources/resize_dashboard.png)

The last fonctionnality of this dashboard is that, if you want to focus in 1 part of the dataset, you can do it on 1 chart and the chages will be done on all the charts. 

![Dashboard with only the last ](ressources/charts_focused.png)

### Computer statistics

By clicking the "See general statistic about the computer" button. you can get to this screen. 
The next screen contains the computer statistics

![The screen with all the computer stats](ressources/stats_screen.png)

### Activity History 

You can also see the last 12 hours of activity of a PC by clicking the "See previous activity" in the dashboard. If there is not 12 hours of activity, we display less.

![The screen with all the computer stats](ressources/activity_history.png)

This dash board has pretty much the same properties of the livestream dashboard, but the charts cannot be moved around.

---
## Remaining bugs  

Here are some bugs that we couldn't fiw in time for the deadline : 

When a chart changes place, it cannot be used to focus on some data.
Reason : the previous DOM element in the "plots" array goes stale and thus cannot receive the "plotly_relayout event". 

In the history dashboard, moving the sliders dont move sliders of other charts (don't know if it's even possible). 

There is also the fact that Windows causes a lot of problems in retrieving information. 
---
## What to do in the future

There is a lot of information on a pc that could be recovered in addition.


We can also try to change the language of the scraper script to a language that would facilitate the retrieval of information from the PC.


--- 
## Special thanks
A big thank you to our teacher, M. ROSA-MARTIN Antonin, for his help !

