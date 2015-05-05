# basic-auth-app

A small nodejs API server which implements basic authentication (using HTTP for simplicity). 

# Setup

After cloning and installing, create a postgres database and run `/users.sql` against it.
Remove the .example extension from the files in the `/config` directory. 
Update `pg.json` to point to your specified database.
Run `node server` at the command prompt.
Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.
