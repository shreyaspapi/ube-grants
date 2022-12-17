# UbeGrants

UbeGrants is a Hackathon project that allows for milestone-based payments using smart contracts.

Ubeswap is in the process of transitioning platform decision making to the Ubeswap DAO (composed of all UBE holders). In order to facilitate contracts and grants fulfillment by the DAO, we have developed a set of smart contracts with the following functions:

- Milestone-based payments: The DAO can transfer a grant lump sum to the contract, which will then disburse the grant according to pre-determined milestone completion dates and amounts.
- Milestone payment approval and cancellation: A DAO Agent multisig wallet has the ability to approve or cancel milestone payments. If a grant's milestones are not met, the funds will be returned to the DAO.
These contracts are written in Solidity and are built using the Hardhat Ethereum development environment.

## Live URLs

- Subgraph: https://thegraph.com/hosted-service/subgraph/shreyaspapi/ubegrants

- Frontend: https://ubegrants.netlify.app/

- Youtube preview: 

[![](https://markdown-videos.deta/youtube/Ov3N1ujIsOE)](https://www.youtube.com/watch?v=Ov3N1ujIsOE)


## Installation

To use these contracts, you will need to have the following installed:

- Solidity
- Hardhat

Once these dependencies are installed, you can clone this repository and install the remaining dependencies by running npm install in the project directory.


## Backend

The contracts are written in solidity and are deployed on the Goerli and CELO alfregos testnets. You can view the contract on the Goerli etherscan here: https://goerli.etherscan.io/address/0x41bb6856e824af55fa2f10d68cf5a74c351cba41

The contracts allow for the disbursement of grants according to milestone completion dates and amounts. They also allow for the approval or cancellation of milestone payments by a DAO Agent multisig wallet.

To compile the contracts, run `npx hardhat compile` in the project directory. This will create the contract artifacts in the build directory.

To deploy the contracts to a local blockchain, run npx hardhat run scripts/deploy.js in the project directory. This will deploy the contracts to the network specified in your Hardhat config file.

You can then use the contracts in your dapp or interact with them using the Hardhat console.

## Frontend

The frontend of the UbeGrants project is located in the Frontend folder. It is written in react and allows users to interact with the contracts on the blockchain.

To run the frontend, you will need to have react installed on your machine. Once react is installed, navigate to the Frontend folder and run npm install to install the dependencies. Then, you can run the frontend by running npm start.

## Contributing

If you would like to contribute to the UbeGrants project, please fork the repository and create a pull request with your changes. All contributions are welcome and appreciated.