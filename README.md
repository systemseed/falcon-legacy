[![CircleCI](https://circleci.com/gh/systemseed/falcon.svg?style=shield&circle-token=7736ea9ff7656c7025fb3727b27a4f9d0be0857d)](https://circleci.com/gh/systemseed/falcon)

# Installation

1. Install Docker

    You need to install Docker and Docker-compose.
    See https://docs.docker.com/install/ for details.

1. (Optional) Install Platform.sh CLI

    You need to install and authenticate the Platform.sh CLI.
    See https://docs.platform.sh/gettingstarted/cli.html for details.

1. Add the following lines to your hosts file:

    ```
    127.0.0.1 gifts.flc.local
    127.0.0.1 main.flc.local
    127.0.0.1 api.flc.local
    127.0.0.1 gifts.api.flc.local
    127.0.0.1 pma.gifts.api.flc.local
    127.0.0.1 donations.api.flc.local
    127.0.0.1 pma.donations.api.flc.local
    ```

1. Download this repository to your local environment:

    ```
    git clone git@github.com:systemseed/falcon.git
    ```

1. Make local environment
  * Installation from config profile

    Open command line terminal, navigate to project root and run
    `make install-config`. If you want to adjust local environment settings
    then first run `make down` and review the `.env` and
    `.docker/docker-compose.override.yml` files. After that run
    `make install-config`.
  * Installation from DB dump

    Use the `make install-db` command instead of `make install-config`.
    
    Then you can stop your work by running `make stop` and continue by running
    `make up`. To remove all the containers you can run `make down`.

### Running ESLint for FrontEnd apps

```
docker-compose run fe_gifts sh
./node_modules/.bin/eslint ./src
```
