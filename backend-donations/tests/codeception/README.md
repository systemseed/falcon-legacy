# Codeception Test Suites


## Prepare for local run and development

1. Make sure all URLs inside of `codeception.yml` file are valid. They should be valid if you're using Falcon Docker.

2. From inside of Docker php container, build test helper CodeCeption files:

```
docker-compose run be_donations sh
cd tests/codeception/
../../vendor/bin/codecept build
```

## Run Unit Tests

**Important:** currently, unit tests require Drupal database to be configured to fully bootstrap Drupal codebase. See `unit/_bootstrap.php` for details.

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

## Run Acceptance Tests

Acceptance tests run on specified WebDriver URL.

Run all acceptance tests in PhantomJS (debug mode):

```
../../vendor/bin/codecept run acceptance --env=phantom --debug
```

Run region specific tests:

```
../../vendor/bin/codecept run acceptance ie/ --env=phantom --debug
```


## Run API Tests

API tests run on specified REST URL.

Run all API tests in debug mode:

```
../../vendor/bin/codecept run api --debug
```
