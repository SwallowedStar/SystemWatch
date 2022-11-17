# SystemWatch

---
## Summary



---
## Description

This tool will let you monitor the status of your Server from anywhere.


---
## Technologies & Dependencies



--- 
## Installing

We will be refering to different party by this vocabular : 
- *NodeServer* : This is the machine that will have the database as well as the Node Backend and Frontend
- *MonitorMachine* : This is the machine that will have the Python monitoring script 

### NodeServer Setup

At first, you need to download all the dependencies to the node projet.
```
cd nodejs
npm install
```

You will then need to install the system_watch_db database.
To do so, just execute the "system_watch_db.sql" script that is present in the database folder.

You'll then need to setup your environment variables.
To do so, create a `.env` file in the nodejs folder with the folowing infos :
- **LISTEN_PORT** : the listening port for expressjs
- **DB_HOST** : where the database will be intalled
- **DB_PORT** : The database used to access the database
- **DB_USER** : The user that will be able to access the database
- **DB_PASSWORD** : The user password
- **DB_NAME** : The name of the database you'll be using. by default, you should put "system_watch_db" 

A default file would look like this : 
```
LISTEN_PORT = 3000
DB_HOST = "127.0.0.1"
DB_PORT = 3306
DB_USER = "root"
DB_PASSWORD = <password>
DB_NAME = "system_watch_db"
```

Once all of that is done, you should see if the build passes the tests : 
```
cd nodejs
npm run test
```

### MonitorMachine Setup


--- 
## How to use


--- 
## Special thanks

