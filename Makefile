.PHONY: default pull up stop down drush shell tests\:prepare tests\:run test install update

# Make sure the local file with docker-compose overrides exist.
$(shell cp -n \.\/docker\/docker-compose\.override\.default\.yml \.\/docker\/docker-compose\.override\.yml)

# Create a .env file if not exists and include default env variables.
$(shell cp -n \.env.default \.env)
include .env

# Define 3 users with different permissions within the container.
# docker-www-data is applicable only for php containers.
docker-www-data = docker-compose exec --user=82:82 $(firstword ${1}) sh -c "$(filter-out $(firstword ${1}), ${1})"
docker = docker-compose exec $(firstword ${1}) sh -c "$(filter-out $(firstword ${1}), ${1})"
docker-root = docker-compose exec --user=0:0 $(firstword ${1}) sh -c "$(filter-out $(firstword ${1}), ${1})"

cyan = `tput setaf 6`
bold = `tput bold`
reset = `tput sgr0`
message = @echo "${cyan}${bold}${1}${reset}"

default: up

pull:
	$(call message,$(PROJECT_NAME): Updating Docker images)
	docker-compose pull

up:
	$(call message,$(PROJECT_NAME): Build and run containers)
	docker-compose up -d --remove-orphans

stop:
	$(call message,$(PROJECT_NAME): Stopping containers)
	docker-compose stop

down:
	$(call message,$(PROJECT_NAME): Removing network & containers)
	docker-compose down -v --remove-orphans

exec-www-data:
	docker-compose exec --user=82:82 php sh

exec:
	docker-compose exec php sh

exec-root:
	docker-compose exec --user=0:0 php sh

drush:
	# Remove the first argument from the list of make commands.
	$(eval ARGS := $(filter-out $@,$(MAKECMDGOALS)))
	$(eval TARGET := $(firstword $(ARGS)))
	$(eval COMMAND_ARGS := $(filter-out $(TARGET), $(ARGS)))
	$(call message,Target is \"$(TARGET)\")
	$(call message,Executing \"drush -r /var/www/html/web $(COMMAND_ARGS) --yes\")
	$(call docker-www-data, $(TARGET) drush -r /var/www/html/web $(COMMAND_ARGS) --yes)

shell:
	# Remove the first argument from the list of make commands.
	$(eval ARGS := $(filter-out $@,$(MAKECMDGOALS)))
	$(eval TARGET := $(firstword $(ARGS)))
	$(eval COMMAND_ARGS := $(filter-out $(TARGET), $(ARGS)))
	$(call message,Target is \"$(TARGET)\")
	$(call message,Executing \"shell $(COMMAND_ARGS)\")
	$(call docker-www-data, $(TARGET) $(COMMAND_ARGS))

###########################
# Container preparations. #
###########################

prepare: | pull prepare\:git prepare\:frontend\:gifts prepare\:frontend\:main \
up prepare\:apibus prepare\:backend\:gifts prepare\:backend\:donations

prepare\:git:
	$(call message,Setting git config to ignore local files chmod)
	@git config core.fileMode false

prepare\:frontend\:gifts: | down
	$(call message,FE Gifts: Installing yarn dependencies)
	@docker-compose run --no-deps fe_gifts yarn install

prepare\:frontend\:main: | down
	$(call message,FE Main: Installing yarn dependencies)
	@docker-compose run --no-deps fe_main yarn install

prepare\:apibus:
	$(call message,API Bus: Installing/updating composer dependencies)
	-$(call docker, api_bus composer install)
	$(call message,API Bus: Copying default local config file into the adjustable local config)
	@cp ./backend-api-bus/src/config/local.default.php ./backend-api-bus/src/config/local.php

prepare\:backend\:gifts:
	$(call message,BE Gifts: Installing/updating composer dependencies)
	-$(call docker, be_gifts composer install)

prepare\:backend\:donations:
	$(call message,BE Donations: Installing/updating composer dependencies)
	-$(call docker, be_donations composer install)

#####################
# Files operations. #
#####################

files\:sync: | files\:sync\:gifts files\:sync\:donations

files\:sync\:gifts: | files\:chown\:wodby\:gifts
	platform mount:download -y --project=${PLATFORM_PROJECT_ID} --environment=${PLATFORM_ENVIRONMENT} --app=${PLATFORM_APPLICATION_GIFTS} \
--mount=web/sites/default/files --target=backend-gifts/web/sites/default/files \
--exclude=css/* --exclude=js/* --exclude=php/* --exclude=styles/*
	$(MAKE) -s files\:chown\:gifts

files\:sync\:donations: | files\:chown\:wodby\:donations
	platform mount:download -y --project=${PLATFORM_PROJECT_ID} --environment=${PLATFORM_ENVIRONMENT} --app=${PLATFORM_APPLICATION_DONATIONS} \
--mount=web/sites/default/files --target=backend-donations/web/sites/default/files \
--exclude=css/* --exclude=js/* --exclude=php/* --exclude=styles/*
	$(MAKE) -s files\:chown\:donations

files\:chown: files\:chown\:gifts files\:chown\:donations

files\:chown\:gifts:
	$(call docker-root, be_gifts chown -R www-data: web/sites/default/files)

files\:chown\:donations:
	$(call docker-root, be_donations chown -R www-data: web/sites/default/files)

files\:chown\:wodby: files\:chown\:wodby\:gifts files\:chown\:wodby\:donations

files\:chown\:wodby\:gifts:
	$(call docker-root, be_gifts chown -R wodby: web/sites/default/files)

files\:chown\:wodby\:donations:
	$(call docker-root, be_donations chown -R wodby: web/sites/default/files)

#####################################
# Installation from config profile. #
#####################################

install\:config: | prepare install\:config\:gifts install\:config\:donations

install\:config\:gifts: | prepare
	$(call message,BE Gifts: Make settings.php writable)
	$(call docker, be_gifts chmod 666 web/sites/default/settings.php)
	$(call message,BE Gifts: Installing site)
	$(MAKE) -s drush be_gifts site-install config_installer
	$(call message,BE Gifts: Restore settings.php)
	git checkout backend-gifts/web/sites/default/settings.php
	$(call message,BE Gifts: Installing the module to import demo content)
	$(MAKE) -s drush be_gifts en $(MODULES_GIFTS)
	$(call message,BE Gifts: Disabling unnecessary modules after demo content import)
	$(MAKE) -s drush be_gifts pmu $(MODULES_GIFTS)

install\:config\:donations: | prepare
	$(call message,BE Donations: Make settings.php writable)
	$(call docker, be_donations chmod 666 web/sites/default/settings.php)
	$(call message,BE Donations: Installing site)
	$(MAKE) -s drush be_donations site-install config_installer
	$(call message,BE Donations: Restore settings.php)
	git checkout backend-donations/web/sites/default/settings.php
	$(call message,BE Donations: Installing the module to import demo content)
	$(MAKE) -s drush be_donations en $(MODULES_DONATIONS)
	$(call message,BE Donations: Disabling unnecessary modules after demo content import)
	$(MAKE) -s drush be_donations pmu $(MODULES_DONATIONS)

####################################
# Installation from database dump. #
####################################

install\:db: | install\:db\:gifts install\:db\:donations

install\:db\:gifts: | prepare files\:sync\:gifts db\:dump\:gifts reinstall\:db\:gifts

install\:db\:donations: | prepare files\:sync\:donations db\:dump\:donations reinstall\:db\:donations

reinstall\:db: | reinstall\:db\:gifts reinstall\:db\:donations

reinstall\:db\:gifts: | db\:import\:gifts update\:gifts

reinstall\:db\:donations: | db\:import\:donations update\:donations

########################
# Database operations. #
########################

db\:dump: | db\:dump\:gifts db\:dump\:donations

db\:dump\:gifts:
	$(call message,BE Gifts: Creating DB dump)
	-$(shell platform db:dump -y --project=${PLATFORM_PROJECT_ID} --environment=${PLATFORM_ENVIRONMENT} --app=${PLATFORM_APPLICATION_GIFTS} --relationship=${PLATFORM_RELATIONSHIP_GIFTS} --gzip --file=${BACKUP_DIR}/${DB_DUMP_NAME_GIFTS}.sql.gz)

db\:dump\:donations:
	$(call message,BE Donations: Creating DB dump)
	-$(shell platform db:dump -y --project=${PLATFORM_PROJECT_ID} --environment=${PLATFORM_ENVIRONMENT} --app=${PLATFORM_APPLICATION_DONATIONS} --relationship=${PLATFORM_RELATIONSHIP_DONATIONS} --gzip --file=${BACKUP_DIR}/${DB_DUMP_NAME_DONATIONS}.sql.gz)

db\:drop: | db\:drop\:gifts db\:drop\:donations

db\:drop\:gifts:
	$(call message,BE Gifts: Dropping DB)
	$(MAKE) -s drush be_gifts sql-drop

db\:drop\:donations:
	$(call message,BE Donations: Dropping DB)
	$(MAKE) -s drush be_donations sql-drop

db\:import: | db\:import\:gifts db\:import\:donations

db\:import\:gifts: | db\:drop\:gifts
	sleep 30
	$(call message,BE Gifts: Importing DB)
	$(call docker-www-data, be_gifts zcat ${BACKUP_DIR}/${DB_DUMP_NAME_GIFTS}.sql.gz | drush sql-cli)

db\:import\:donations: | db\:drop\:donations
	sleep 30
	$(call message,BE Donations: Importing DB)
	$(call docker-www-data, be_donations zcat ${BACKUP_DIR}/${DB_DUMP_NAME_DONATIONS}.sql.gz | drush sql-cli)

####################
# Update backends. #
####################

update: | prepare update\:gifts update\:donations

update\:gifts:
	$(call message,BE Gifts: Updating cache)
	$(MAKE) -s drush be_gifts cr
	$(call message,BE Gifts: Applying database updates)
	$(MAKE) -s drush be_gifts updb
	$(call message,BE Gifts: Importing configs)
	$(MAKE) -s drush be_gifts cim
	$(call message,BE Gifts: Applying entity updates)
	$(MAKE) -s drush be_gifts entup

update\:donations:
	$(call message,BE Donations: Updating cache)
	$(MAKE) -s drush be_donations cr
	$(call message,BE Donations: Applying database updates)
	$(MAKE) -s drush be_donations updb
	$(call message,BE Donations: Importing configs)
	$(MAKE) -s drush be_donations cim
	$(call message,BE Donations: Applying entity updates)
	$(MAKE) -s drush be_donations entup

##########
# Tests. #
##########

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
	$(call message,Target is \"$(firstword $(ARGS))\")
	$(call message,Executing \"\./vendor/bin/codecept --config=tests/codeception run $(filter-out $(firstword $(ARGS)), $(ARGS))\")
	$(call docker, $(firstword $(ARGS)) ./vendor/bin/codecept --config=tests/codeception run $(filter-out $(firstword $(ARGS)), $(ARGS)) --steps)

# https://stackoverflow.com/a/6273809/1826109
%:
	@:
