#!/usr/bin/env bash

# This is a Platform.sh post-deploy script for Drupal 8 backends by Platform
# on each deploy.

# Fail deploy on the first failed command.
set -e
# Go to Drupal folder.
cd web
echo "== DEPLOY STARTED $(date +"%d.%m.%Y %T") =="

# Measure and log execution time of each command.
time drush -y cache-rebuild
time drush -y updatedb
time drush -y config-import
time drush -y entup

echo "== DEPLOY SUCCESSFULLY COMPLETED $(date +"%d.%m.%Y %T") =="
