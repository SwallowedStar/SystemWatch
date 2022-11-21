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

Once you've done that, you can import the database into mysql.
There is the SQL creation script in the `database/system_watch_database.sql` file.
```
sudo docker exec -i <INSTANCE NAME> mysql -uroot -<MYSQL ROOT USER PASSWORD> < database/system_watch_db.sql
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

It passes only if all the tests at the end show `true`

### MonitorMachine Setup


--- 
## How to use


--- 
## Special thanks

