.PHONY: falcon falcon-install falcon-update drush test

# Make sure the local file with docker-compose overrides exist.
$(shell ! test -e \.\/docker\/docker-compose\.override\.yml && cat \.\/docker\/docker-compose\.override\.default\.yml > \.\/docker\/docker-compose\.override\.yml)

# Create a .env file if not exists and include default env variables.
$(shell ! test -e \.env && cat \.env.default > \.env)

# Make all variables from the file available here.
include .env

# Define two users for with different permissions within the container.
# docker-drupal is applicable only for php containers.
docker-drupal = docker-compose exec --user=82:82 $(firstword ${1}) sh -c "$(filter-out $(firstword ${1}), ${1})"
docker = docker-compose exec $(firstword ${1}) sh -c "$(filter-out $(firstword ${1}), ${1})"

drush:
	# Remove the first argument from the list of make commands.
	$(eval ARGS := $(filter-out $@,$(MAKECMDGOALS)))
	@echo Target is \"$(firstword $(ARGS))\"
	@echo Executing \"drush -r /var/www/html/web $(filter-out $(firstword $(ARGS)), $(ARGS)) --yes\"
	$(call docker-drupal, $(firstword $(ARGS) drush -r /var/www/html/web $(filter-out $(firstword $(ARGS)), $(ARGS)) --yes)

shell:
	# Remove the first argument from the list of make commands.
	$(eval ARGS := $(filter-out $@,$(MAKECMDGOALS)))
	@echo Target is \"$(firstword $(ARGS))\"
	@echo Executing \"shell $(filter-out $(firstword $(ARGS)), $(ARGS))\"
	$(call docker-drupal, $(firstword $(ARGS) $(filter-out $(firstword $(ARGS)), $(ARGS)))

tests\:prepare:
	# Prepare codeception to run.
	$(call docker, be_gifts ./vendor/bin/codecept --config=tests/codeception build)
	# Run Gifts frontend with SSR support to test SSR as well.
	@docker-compose stop fe_gifts
	@docker-compose run fe_gifts yarn build
	@docker-compose run -d fe_gifts yarn start:server
	# Give node.js server several seconds to initialize.
	@sleep 5

tests\:run:
	$(MAKE) -s test be_gifts acceptance

test:
	# Remove the first argument from the list of make commands.
	$(eval ARGS := $(filter-out $@,$(MAKECMDGOALS)))
	@echo Target is \"$(firstword $(ARGS))\"
	@echo Executing \"\./vendor/bin/codecept --config=tests/codeception run $(filter-out $(firstword $(ARGS)), $(ARGS))\"
	$(call docker, $(firstword $(ARGS)) ./vendor/bin/codecept --config=tests/codeception run $(filter-out $(firstword $(ARGS)), $(ARGS)) --steps)

env\:up:
	@docker-compose up -d --remove-orphans

env\:down:
	@docker-compose down --remove-orphans

#########################################
## Builds the falcon from the buttom up #
#########################################

falcon\:install:
	@echo "Installing Falcon from the bottom up..."

	@echo "Setting git config to ignore local files chmod..."
	@git config core.fileMode false

	@echo "###############################"
	@echo "# Preparing Docker containers #"
	@echo "###############################"

	@echo "Making sure Docker is not running..."
	@docker-compose down --remove-orphans
	@echo "Fetching Docker images..."
	docker-compose pull --parallel

	@echo "############################"
	@echo "# Preparing Gifts Frontend #"
	@echo "############################"

	@echo "Installing yarn dependencies for Gifts Frontend..."
	@docker-compose run --no-deps fe_gifts yarn install

	@echo "###########################"
	@echo "# Preparing Main Frontend #"
	@echo "###########################"

	@echo "Installing yarn dependencies for Main Frontend..."
	@docker-compose run --no-deps fe_main yarn install

	# Spinning up all containers now.
	docker-compose up -d --remove-orphans

	@echo "#####################"
	@echo "# Preparing API BUS #"
	@echo "#####################"

	@echo "Installing composer dependencies for API Bus..."
	-$(call docker, api_bus composer install)
	@echo "Copying default local config file for API bus into the adjustable local config..."
	@cp ./backend-api-bus/src/config/local.default.php ./backend-api-bus/src/config/local.php

	@echo "###########################"
	@echo "# Preparing Gifts backend #"
	@echo "###########################"

	@echo "Installing composer dependencies for Gifts Backend..."
	-$(call docker, be_gifts composer install)
	@echo "Installing Gifts site..."
	$(MAKE) -s drush be_gifts site-install config_installer
	@echo "Installing the module to import demo content..."
	$(MAKE) -s drush be_gifts en falcon_demo_content
	@echo "Disabling unnecessary modules after demo content import..."
	$(MAKE) -s drush be_gifts pmu falcon_demo_content default_content better_normalizers hal

	@echo "###############################"
	@echo "# Preparing Donations backend #"
	@echo "###############################"

	@echo "Installing composer dependencies for Donations Backend..."
	-$(call docker, be_donations composer install)
	@echo "Installing Donations site..."
	$(MAKE) -s drush be_donations site-install config_installer
	@echo "Installing the module to import demo content..."
	$(MAKE) -s drush be_donations en falcon_demo_content
	@echo "Disabling unnecessary modules after demo content import..."
	$(MAKE) -s drush be_donations pmu falcon_demo_content default_content better_normalizers hal

######################################################
## Brings the falcon up to date with latest changes ##
######################################################

falcon\:update:
	@echo "Updating the code from the git remote branch..."
	@git pull origin $(git rev-parse --abbrev-ref HEAD)

	# Frontend restart is not needed, because dontainers restart will
    # trigger yarn install anyway.
	@echo "Restarting Docker containers..."
	@docker-compose down --remove-orphans
	docker-compose up -d --remove-orphans

	@echo "Updating composer dependencies for Donations backend..."
	-$(call docker, be_donations composer install)
	@echo "Updating cache on Donations backend..."
	$(MAKE) -s drush be_donations cr
	@echo "Applying database updates on Donations backend..."
	$(MAKE) -s drush be_donations updb
	@echo "Importing configs into Donations backend..."
	$(MAKE) -s drush be_donations cim
	@echo "Applying entity updates on Donations backend..."
	$(MAKE) -s drush be_donations entup

	@echo "Updating composer dependencies for Gifts backend..."
	-$(call docker, be_gifts composer install)
	@echo "Updating cache on Gifts backend..."
	$(MAKE) -s drush be_gifts cr
	@echo "Applying database updates on Gifts backend..."
	$(MAKE) -s drush be_gifts updb
	@echo "Importing configs into Gifts backend..."
	$(MAKE) -s drush be_gifts cim
	@echo "Applying entity updates on Gifts backend..."
	$(MAKE) -s drush be_gifts entup

# https://stackoverflow.com/a/6273809/1826109
%:
	@:
