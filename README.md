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

###### 2. Install sequelize-cli:
- `sudo npm install -g sequelize-cli`

###### 3. Create db and admin user:
 - Before run and test connection, make sure you have created a database as described in the above configuration. You can use the `psql` command to create a user and database.
   - `psql postgres --u postgres`

- Next, type this command for creating a new user with password then give access for creating the database.
  - `postgres-# CREATE ROLE admin WITH LOGIN PASSWORD 'admin_pass';`
  - `postgres-# ALTER ROLE admin CREATEDB;`

- Quit `psql` then log in again using the new user that previously created.
  - `postgres-# \q`
  - `psql postgres -U admin`

- Type this command to creating a new database.
  - `postgres=> CREATE DATABASE nodejs_backend_db;`

- Then give that new user privileges to the new database then quit the `psql`.
  - `postgres=> GRANT ALL PRIVILEGES ON DATABASE nodejs_backend_db TO admin;`
  - `postgres=> \q`

###### 4. Run db migrations and seeds:
 - `sequelize db:migrate && sequelize db:seed:all`
 
 ------------
 
 ##### Start development build:
 - `yarn start:dev`
 
 ##### Start production build:
 - `yarn start`