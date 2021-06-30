# detroit-cuisine-ratings

This tool uses Yelp APIs to pull category and rating data for Detroit businesses.

## How to run

### Basics

1. Clone the repo and install the dependencies with `yarn install`.
2. Paste your Yelp API key into the .env file where indicated.

### Setup the database

1. If you do not have postgres installed or a service running, you can run `sudo sh scripts/install_postgres.sh`. Note that it will prompt you for an admin password.
2. Run the script `create_database.sql` to setup the database and yelp user. If you want to run it in a psql terminal, log in as admin with `sudo -u postgres psql`.

### Run the program

Execute `yarn start`.
