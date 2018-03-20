#!/bin/bash

# Script to push Falcon's master to client repositories.
# Triggered by Circle CI.
if [ $CIRCLE_BRANCH != "master" ]; then
  exit 0
fi

git config --global user.email "circleci@systemseed.com"
git config --global user.name "Falcon Circle CI"

# Push to the public repo if tests are green.
git remote add public git@github.com:systemseed/falcon.git
git push --force public master

# Find all variables set in CIRCLE CI starting with CLIENT_*.
vars=$(env | awk -F '=' '{print $1}' | grep 'CLIENT_*') || true

# Create a new variable $client_repos which is now array of env vars
# starting with CLIENT_*.
read -a client_repos <<<$vars

# Every CLIENT_* variable should define a remote git repo.
# So we loop through client repos and deploy changes to each of those.
for repo_var in "${client_repos[@]}"
do
  # Here ${repo_var} is name of env variable, ${!repo_var} is git remote url.
  echo "Pushing changes to ${!repo_var} (${repo_var})..."
  if ! git config remote.${repo_var}.url > /dev/null; then
    git remote add ${repo_var} ${!repo_var}
  fi;

  # Fetch latest version of "falcon" branch from client repository.
  git fetch ${repo_var} falcon

  # Create new temporary branch on top of "falcon".
  git checkout -B ${repo_var}-falcon ${repo_var}/falcon

  # Merge Falcon's $CIRCLE_BRANCH into the new branch.
  git merge --no-edit --no-ff $CIRCLE_BRANCH

  git push --force ${repo_var} ${repo_var}-falcon:falcon

  # Get back to the original branch.
  git checkout $CIRCLE_BRANCH
done
