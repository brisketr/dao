# Development

- [Deployment](./Deployment.md)

## Install

    npm install

## Compile the Solidity contracts

When smart contracts are changed, solidity contract typescript must be compiled
using the following command:

    npm run compile

## Test the Solidity contracts

To test the solidity contracts, run:

    npm run test:core

### Run a single test

To run an indivdual test, run:

    npm run -w core -- test <test file>

For example:

    npm run -w core -- test test/infoex/v1/InfoExchange.ts

## Start both the frontend and localhost dev hardhat node

This will start a full testing environment, including compiling and deploying
the smart contracts to a hardhat dev node running on `localhost`.

    npm run start

## Start the hardhat node

To start just the hardhat dev node, run:

    npm run hardhat

## Run app unit tests

To run the app unit tests, run:

    npm run test:app

### Run a single app unit test

To run an indivdual app unit test, run:

    npm exec -w app -- ts-mocha --timeout 10000 --type-check -p tsconfig.json src/infoex/v1/encryption.spec.ts -g 'should generate'

Or add `.only` to the `describe` or `it` block in the `.spec.ts` to run only the
specified test.

## Start the app (dev mode)

To start just the app in dev mode, run:

    npm run app:dev

## Run a nodejs command in a workspace

This project uses `nodejs` workspaces. To run a command in a workspace, append
the -w `<workspace name>` flag, e.g.:

    npm install {package name} --save-dev -w app
    # use --save instead of --save-dev if it's a runtime dep

To use exec in a workspace:

    npm exec -w <workspace name> -- <command>

For example, start the `localhost` hardhat node:

    npm exec -w core -- hardhat node
