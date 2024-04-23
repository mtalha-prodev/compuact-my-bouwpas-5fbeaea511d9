# Bouwpas app

The purpose of this app is to provide information and functionality for workers on construction sites.

## Table of contents

- [Bouwpas app](#bouwpas-app)
  - [Table of contents](#table-of-contents)
  - [Get started](#get-started)
    - [Environment](#environment)
    - [Packages](#packages)
    - [Running the dev environment](#running-the-dev-environment)
    - [Create a test build](#create-a-test-build)
  - [Authentication modes](#authentication-modes)
  - [Not authenticated](#not-authenticated)
  - [Authenticated](#authenticated)
    - [workeruser](#workeruser)
    - [accountuser](#accountuser)
  - [App Structure](#app-structure)
  - [Translations](#translations)

## Get started

### Environment

This app is built on TypeScript, React Native and Expo. This allows us to make a native app for both Android and iOS at once. We use the managed flow in Expo.

You can use Expo to test your work on an [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/), [iOS Simulator (Mac only)](https://docs.expo.dev/workflow/ios-simulator/) or on your [physical devices using Expo Go](https://docs.expo.dev/get-started/expo-go/).

### Packages

We use `yarn` as the package manager. Some highlights:

- For navigation, we use `react-navigation`.
- For icons, we use `@fortawesome/fontawesome-pro`
- For styling we use `native-base` (which will deprecate soon, unfortunately)
- `prettier` for code style
- To ensure full compatibility, when choosing new packages, we prefer to use an `expo`-package if that is available

### Running the dev environment

If your development environment is not set up yet, start here:

https://docs.expo.dev/get-started/installation/

Then, check out the git repo.

    git clone git@bitbucket.org:compuact/my-bouwpas.git

Copy the `.env.template` file and name the copy `.env`. Fill this file with the information you get from a Bouwpas team member.

Before running yarn, you need to export the token for FontAwesome Pro. Request this token from a Bouwpas team member.

Then, let's go:

    export FONTAWESOME_TOKEN={get_from_bouwpas_team}
    yarn
    npx expo start

To make logging in (on the Bouwpas ID Provider) work, please send your **internal** IP address to a Bouwpas team member.

### Create a test build

If you have an Expo account in the Bouwpas organization, you can create a test build.

Globally install EAS CLI (don't confuse this with Expo CLI)

    npm install -g eas-cli

Simply run the following command

    eas build {options}

In the options you can add:

- `--profile` with one of the profiles found in [eas.json](https://docs.expo.dev/build/eas-json/) in the project root.
- `--platform` with `android` or `ios` (omit for both)

So if you want to create an internal test build for Android that connects to the Staging (Acceptatie) Bouwpas API and ID Provider, you do this:

    eas build -p android --profile preview-staging-apk

If the build succeeds, the cli will offer you to download the apk and immediately install it on an Android Emulator you have running.

## Authentication modes

There are roughly speaking two modes in Bouwpas

1. Not authenticated
2. Authenticated
   - As `workeruser`, and/or
   - As `accountuser`

If the authenticated user has both userTypes, they can switch between the two modes in the drawer menu of the app.

## Not authenticated

When a user first downloads the app, they are not logged in. In this part of the app they cannot see projects or other user-linked data, obviously. One thing that is accessible, for instance, is the library module (though that filters out user-specific content by itself).

## Authenticated

#### workeruser

A worker is someone who works on one or more construction projects. This can be an employee of any subcontractor on the project.

#### accountuser

An accountuser is someone who works on the construction site but in specific roles, eg. a site manager, health and safety inspector, gatekeeper. Because of their work, they get access to a different set of features.

Search for `currentUserType` in the code to find how this is used.

## App Structure

- App
  - Version check
  - Wizard (only shown on first startup)
  - Not authenticated
    - Projects (which presents login options)
    - Library
  - Authenticated
    - Worker
      - Projects
        - Bouwpas ID
        - QR code scanner
        - Project detail
          - Attendance overview+actions
          - Safesight integration buttons (MOS)
          - Project-specific Library
      - Library
      - Toolbox
    - Gatekeeper
      - Projects
        - Project detail
          - Safesight integration buttons (MOS)
      - Onsite
        - Project selector
          - Number of people onsite now
          - Check a Bouwpas badge
      - Toolbox
        - List of toolbox meetings presented
        - Create a new toolbox meeting
  - My employers
  - My privacy
  - Settings
    - Change language
    - Help
    - Logout

## Translations

The app supports localization. The user can set the language in the wizard on first startup, and in the settings screen later.

Translation files are \*.json files, and must be placed in `/app/i18n/languages/json`. If you add another language, do not forget to also create a \*.ts file

Note: Toolbox content also supports localization, but this is not based on the app setting. Instead, that is supported separately by the Toolbox content provided by the Bouwpas API.
