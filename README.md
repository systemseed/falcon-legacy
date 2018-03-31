[![CircleCI](https://circleci.com/gh/systemseed/falcon.svg?style=shield&circle-token=7736ea9ff7656c7025fb3727b27a4f9d0be0857d)](https://circleci.com/gh/systemseed/falcon)

## Getting started
    
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
    
2. Download this repository to your local environment:

    ```
    git clone git@github.com:systemseed/falcon.git
    ```
    
3. Run `make falcon install` in the root of repository. Profit!

4. TODO






## Running ESLint for FrontEnd apps

```
docker-compose run fe_gifts sh
./node_modules/.bin/eslint ./src
```

