# nodejs-backend

#### Run App on local machine:

------------

##### Install local dependencies:
- `yarn install`

------------

##### Adjust local db:
###### 1.  Install postgres:
 - MacOS:
   - `brew install postgres`

- Ubuntu:
  - `sudo apt update`
  - `sudo apt install postgresql postgresql-contrib`

###### 2. Create db and admin user:
 - Before run and test connection, make sure you have created a database as described in the above configuration. You can use the `psql` command to create a user and database.
   - `psql -U postgres`

- Type this command to creating a new database.
  - `postgres=> CREATE DATABASE development OWNER postgres;`
  - `postgres=> \q`
 
 ------------

 ##### Setup database tables:
 - `yarn reset`
 
 ##### Start development build:
 - `yarn start:dev`

 ##### Start production build:
 - `yarn start`

 ------------

 #### Api Documentation (Swagger)

 http://localhost:8080/api-docs (local host)
 
 http://host_name/api-docs

 ------------

 ##### Docker:
 
 See instructions in a `docker` folder if you want to run this backend alongside with a frontend and a database.
 In this case you don't need to build docker image manually and run commands below.
 
 1. Make sure you have Postgres installed locally like in [Adjust local db](#adjust-local-db):
 2. Build an image `docker build -t um-backend-image .`
 3. Run a container `docker run -p 8080:8080 -d um-backend-image`
 4. Now the api should be available by `http://localhost:8080/api`
