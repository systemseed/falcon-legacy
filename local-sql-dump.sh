#!/usr/bin/env bash

PSH_ENV=master
DB_CONTAINERS=("be_donations_mariadb" "be_gifts_mariadb")

# If number of args passed is greater than 0
if [ $# -gt 0 ]; then
  PSH_ENV=$1
fi

# Dump database for DONATIONS backend.
echo "Dumping Donations database..."
platform db:dump -y --project=ozkalhzfgtcls --environment=${PSH_ENV} --app=backend-donations --file=./backend-donations/sql-dump/dump.sql

# Dump database for GIFTS backend.
echo "Dumping Gifts database..."
platform db:dump -y --project=ozkalhzfgtcls --environment=${PSH_ENV} --app=backend-gifts --file=./backend-gifts/sql-dump/dump.sql

# Loop over the containers and rebuild them.
for CONTAINER in "${DB_CONTAINERS[@]}"
do
  # Kill container if it's already running.
  if docker-compose ps ${CONTAINER} | grep -q Up; then
    docker-compose kill ${CONTAINER}
  fi
  # If the container is dead then remove it.
  if docker-compose ps ${CONTAINER} | grep -q Exit; then
    docker-compose rm -f ${CONTAINER}
  fi

  # When starting it will use the new DB dump.
  docker-compose up -d ${CONTAINER}
done
