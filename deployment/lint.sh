#!/usr/bin/env bash

returncode () {
    if [[ $2 -ge 1 ]]; then
        printf "\e[101mERROR %s: %s\e[49m\n" "$1" "$2"
    else
        printf "\e[42mOK %s: %s\e[49m\n" "$1" "$2"
    fi
}

echo 'run ESLint'
yarn lint
let RETURN_CODE+=$?

returncode "ESLint " $RETURN_CODE;

# allow skipping ESLint result
RETURN_CODE=0;

exit $RETURN_CODE

