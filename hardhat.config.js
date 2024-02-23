/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  networks: {
    etherlinkTestnet: {
      url: process.env.ETHERLINK_TESTNET_URL,
      allowUnlimitedContractSize: true,
      chainId: 128123,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
    },
    etherlink: {
      url: process.env.ETHERLINK_URL,
      allowUnlimitedContractSize: true,
      chainId: 128384968398,
      accounts: [process.env.PRIVATE_KEY],
    },
    bscTestnet: {
      url: process.env.BSC_TESTNET_URL,
      allowUnlimitedContractSize: true,
      chainId: 97,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
    },
    bsc: {
      url: process.env.BSC_URL,
      allowUnlimitedContractSize: true,
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      etherlinkTestnet: process.env.ETHERSCOUT_API_KEY,
      etherlink: process.env.ETHERSCOUT_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
    },
    customChains: [
      {
        network: 'etherlinkTestnet',
        chainId: 128123,
        urls: {
          apiURL: 'https://testnet-explorer.etherlink.com/api',
          browserURL: 'https://testnet-explorer.etherlink.com',
        },
      },
      {
        network: 'etherlink',
        chainId: 128384968398,
        urls: {
          apiURL: 'https://explorer.etherlink.com/api',
          browserURL: 'https://explorer.etherlink.com',
        },
      },
    ],
  },
  solidity: {
    version: '0.8.22',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
