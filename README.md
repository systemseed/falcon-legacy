[![CircleCI](https://circleci.com/gh/systemseed/falcon.svg?style=shield&circle-token=7736ea9ff7656c7025fb3727b27a4f9d0be0857d)](https://circleci.com/gh/systemseed/falcon)

# Falcon

This is the main repository for Falcon. You should start your journey by cloning this repo and following the instructions in this file.

## Understanding the project's structure

This repo contains Platform.sh multi-app project.
You'll find more info about it at their [documentation](https://docs.platform.sh/configuration/app/multi-app.html).


## Getting started

1. Download this repo to your local environment:

    ```
    git clone git@github.com:systemseed/falcon.git
    ```

2. Install [Platform.sh CLI](https://github.com/platformsh/platformsh-cli):

    ```
    curl -sS https://platform.sh/cli/installer | php
    ```

    Don't forget to authenticate after the installation. CLI docs to the rescue.

3. Run bash script `./local-prepare.sh` in the git root to prepare all necessary dependencies & local environment.

4. Add the following lines to your hosts file:

    ```
    127.0.0.1 gifts.flc.local api.flc.local gifts.api.flc.local donations.api.flc.local # FALCON installation
    ```
5. Run `docker-compose up -d`. Profit!

## Accessing web sites locally

### Gifts Frontend

[http://gifts.flc.local](http://gifts.flc.local)

### Gifts Backend

[http://gifts.api.flc.local](http://gifts.api.flc.local)

### Donations Backend

[http://donations.api.flc.local](http://donations.api.flc.local)

### API Bus

[http://api.flc.local](http://api.flc.local)


## Running ESLint for FrontEnd apps

```
docker-compose run fe_gifts sh
./node_modules/.bin/eslint ./src
```

## Shutting down the environments

To shut the environment run `docker-compose stop`.
