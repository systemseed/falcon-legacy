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
# TODO: investigate and resolve.
# Below is an example of popular error from /tmp/log/deploy.log.
#
# Import the listed configuration changes? (y/n): y
# Drupal\Core\Config\ConfigImporterException: There were errors          [error]
# validating the config synchronization. in
# Drupal\Core\Config\ConfigImporter->validate() (line 728 of
# /app/web/core/lib/Drupal/Core/Config/ConfigImporter.php).
# The import failed due for the following reasons:                       [error]
# Configuration <em class="placeholder">devel.settings</em> depends on
# the <em class="placeholder">Devel</em> module that will not be
# installed after import.
# Configuration <em class="placeholder">devel.toolbar.settings</em>
# depends on the <em class="placeholder">Devel</em> module that will
# not be installed after import.
# Configuration <em class="placeholder">reroute_email.settings</em>
# depends on the <em class="placeholder">Reroute emails</em> module
# that will not be installed after import.
# Command exited with non-zero status 1
# See https://circleci.com/gh/systemseed/cw2-uk/371 for example.
#
time drush -y config-import
time drush -y entup

echo "== DEPLOY SUCCESSFULLY COMPLETED $(date +"%d.%m.%Y %T") =="
