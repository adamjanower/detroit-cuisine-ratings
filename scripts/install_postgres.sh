#!/bin/sh

# Install the packages
sudo apt update
sudo apt install postgresql postgresql-contrib

# Prompt for a password for the default user
sudo passwd postgres

# Restart the terminal for the password to take effect
reset

# Start the postgres service
sudo service postgresql start
