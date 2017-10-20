# Codeception Test Suites


## Prepare for local run and development

1. Copy default `codeception.default.yml` config file to `codeception.yml`.

2. Make sure all URLs inside of `codeception.yml` file are valid. They should be valid if you're using Falcon Docker.

3. From inside of Docker php container, build test helper CodeCeption files:

```
docker-compose run api_bus sh
cd tests/codeception/
../../vendor/bin/codecept build
```

## Run Unit Tests

Unit tests run on local codebase. No URL needs to be specified.

Run the whole unit test suite:

```
../../vendor/bin/codecept run unit --debug
```

Run shared tests (both regions):

```
../../vendor/bin/codecept run unit shared/ --debug
```

Run specific Cest:

```
../../vendor/bin/codecept run unit shared/ExampleCest.php --debug
```

## Run API Tests

API tests run on specified REST URL.

Run all API tests in debug mode:

```
../../vendor/bin/codecept run api --debug
```
