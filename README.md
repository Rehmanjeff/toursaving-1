# Toursaving
The project aims to create a user-friendly platform where users can search for locations, book rides, and allow the admin to access booking information. The goal is to enhance the travel experience by offering exceptional Car Rental and chauffeur drive services at competitive prices. Our commitment is to ensure customer satisfaction and provide users with the freedom to explore their desired destinations exactly as they envision.

## Frontend

### Techonlogy
NextJS v13
### Requirements
1- NodeJS 19 or higher<br />
2- Redis<br />
3- PostgreSQL
### Instalation and Setup
1- Clone the repository: git clone https://github.com/Rehmanjeff/nextjs-toursaving.git<br />
2- Setup Redis<br />
3- Setup postgreSQL<br />
4- Navigate to project root and run npm install<br />
5- Run npm run dev
### Setup Redis
1- Make sure its active by running the following command<br />redis-cli ping
### Setup postgreSQL
1- Make sure the postgreSQL server is active
<br />Check status (Mac): pg_ctl -D /usr/local/var/postgres status
<br />Check status (Linux): systemctl status postgresql
<br />Check status (Windows): pg_ctl status<br />
2- Open the pg_hba.conf file. Replace version with your postgres version
<br />sudo nano /etc/postgresql/version/main/pg_hba.conf <br />
3- Find the lines that correspond to "local" connections and make sure the authentication method is set to "peer"<br />
4- Make sure you have a user setup on postgreSQL with name postgres and password of your choice<br />
5- Create database in postgres with name toursaving with the following command
<br />createdb -h localhost -U postgres -W toursaving<br />
6- Run migrations with the following command. Replace password with your db password
<br />DATABASE_URL=postgres://postgres:password@localhost:5432/toursaving npx node-pg-migrate up<br />
7- Access your database with the following command
<br /> psql -h localhost -U postgres -d toursaving -p 5432 -W
