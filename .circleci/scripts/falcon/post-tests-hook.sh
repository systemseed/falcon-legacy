#!/bin/bash
# Environment variables (set these via CircleCI GUI):
# FALCON_CI_TO_TRIGGER_TOKEN - token from CircleCI to use API. Can be generate in 'API Permissions' section of CircleCI settings.
# FALCON_CI_TO_TRIGGER_USERNAME - the GitHub or Bitbucket account username used by CircleCI build.
# FALCON_CI_TO_TRIGGER_PROJECT - the GitHub or Bitbucket project name used by CircleCI build.

# Trigger other CircleCI build if all tests pass.
# See CircleCI documentation for more information: https://circleci.com/docs/api/v1-reference/#new-build-branch
if [ -v FALCON_BUILD_TO_TRIGGER_CI_TOKEN ] && [ -v FALCON_CI_TO_TRIGGER_USERNAME ] && [ -v FALCON_CI_TO_TRIGGER_PROJECT ] && [ $CIRCLE_BRANCH != "master" ] && [ $CIRCLE_BRANCH != "stage" ]; then
  curl -X POST https://circleci.com/api/v1.1/project/github/${FALCON_CI_TO_TRIGGER_USERNAME}/${FALCON_CI_TO_TRIGGER_PROJECT}/tree/master?circle-token=${FALCON_BUILD_TO_TRIGGER_CI_TOKEN}
fi
