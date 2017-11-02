#!/usr/bin/env bash

# Install composer dependencies inside of APIBus
docker-compose run api_bus composer install

# Install composer inside of Gifts Backend.
docker-compose run be_gifts composer install

# Install composer inside of Gifts Backend.
docker-compose run be_donations composer install

# Install npm dependencies of Gifts Frontend.
docker-compose run fe_gifts npm install

# Do the necessary step to configure API bus initially.
cp ./backend-api-bus/src/config/local.default.php ./backend-api-bus/src/config/local.php

# Boot the dev environments.
docker-compose up -d

# @todo: Ask if user want to reinstall.
# @todo: Uncomment to reconfigure site.
# Prepares certificates for Gifts backend.
docker-compose run be_gifts openssl genrsa -out ./certificates/private.key 2048
docker-compose run be_gifts openssl rsa -in ./certificates/private.key -pubout > backend-gifts/certificates/public.key

# Use generated keys for Donations backend.
cp ./backend-gifts/certificates/public.key ./backend-donations/certificates/public.key
cp ./backend-gifts/certificates/private.key ./backend-donations/certificates/private.key

cp ./backend-gifts/web/sites/default/example.settings.local.php ./backend-gifts/web/sites/default/settings.local.php
cp ./backend-donations/web/sites/default/example.settings.local.php ./backend-donations/web/sites/default/settings.local.php

# Run site installation.
docker-compose run be_gifts drush site-install config_installer --root='./web' --yes
 # To create a demo content.
docker-compose run be_gifts drush en flc_demo --root='./web' --yes
# Disable unnecessary modules.
docker-compose run be_donations drush pmu flc_demo default_content better_normalizers hal --root='./web' --yes

# Run site installation.
docker-compose run be_donations drush site-install config_installer --root='./web' --yes
# To create a demo content.
docker-compose run be_donations drush en flc_demo --root='./web' --yes
# Disable unnecessary modules.
docker-compose run be_donations drush pmu flc_demo default_content better_normalizers hal --root='./web' --yes