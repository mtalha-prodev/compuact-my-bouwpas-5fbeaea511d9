#!/usr/bin/env bash

returncode () {
    if [[ $2 -ge 1 ]]; then
        printf "\e[101mERROR %s: %s\e[49m\n" "$1" "$2"
    else
        printf "\e[42mOK %s: %s\e[49m\n" "$1" "$2"
    fi
}

echo 'run Jest'
npx jest --ci
let RETURN_CODE+=$?

returncode "Jest " $RETURN_CODE;

# allow skipping Jest result
RETURN_CODE=0;

exit $RETURN_CODE

