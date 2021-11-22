# Development

- [Deployment](./Deployment.md)

## Install

    npm install

## Compile the Solidity contracts

    npm compile

## Start both the frontend and localhost dev hardhat node

This will start a full testing environment, including compiling and deploying
the smart contracts to a hardhat dev node running on `localhost`.

    npm run start

## Run a nodejs command in a workspace

This project uses `nodejs` workspaces. To run a command in a workspace, append
the -w `<workspace name>` flag, e.g.:

    npm install {package name} --save-dev -w app
    # use --save instead of --save-dev if it's a runtime dep

To use exec in a workspace:

    npm exec -w <workspace name> -- <command>

For example, start the `localhost` hardhat node:

    npm exec -w core -- hardhat node
