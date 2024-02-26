const etherlinkTestnetDeployments = require('../deployments/etherlinkTestnet.json');
const bscTestnetDeployments = require('../deployments/bscTestnet.json');
const hre = require('hardhat');

const endpointIds = {
  sepolia: '40161',
  bscTestnet: '40102',
  avalancheFujiTestnet: '40106',
  polygonMumbai: '40109',
  arbitrumSepolia: '40231',
  optimismSepolia: '40232',
  etherlinkTestnet: '40239',
  mainnet: '30101',
  bsc: '30102',
  avalanche: '30106',
  polygon: '30109',
  arbitrumOne: '30110',
  optimisticEthereum: '30111',
};

const networkName = hre.network.name;
const targetNetworkName = process.env.targetNetworkName;

async function main() {
  const ignTokenDeployments = {
    etherlinkTestnet: etherlinkTestnetDeployments.IGNToken,
    bscTestnet: bscTestnetDeployments.IGNToken,
  };

  console.log(
    `Calling setPeer on your ${networkName} OFT for ${targetNetworkName} network.`
  );

  const Token = await hre.ethers.getContractFactory('IGNToken');
  const token = await Token.attach(ignTokenDeployments[networkName]);

  // const overrides = {
  //   gasPrice: 100000000000, // Can set this >= to the number read from Ganache window
  //   gasLimit: 6721975, // Use the same gasLimit as read from Ganache window (or a bit higher if still having issue)
  // };

  function formatBytes32String(bytes20String) {
    const bytes32String =
      '0x' + '0'.repeat(24) + bytes20String.substring(2, bytes20String.length);
    return bytes32String;
  }

  await token.setPeer(
    endpointIds[targetNetworkName],
    formatBytes32String(ignTokenDeployments[targetNetworkName])
    // overrides
  );

  const isPeer = await token.isPeer(
    endpointIds[targetNetworkName],
    formatBytes32String(ignTokenDeployments[targetNetworkName])
  );

  if (isPeer) {
    console.log(
      `Your OFT on ${targetNetworkName} has been set as a peer on the ${networkName} OFT.`
    );
  } else {
    console.log(
      `Failed to set your OFT on ${targetNetworkName} as a peer on the ${networkName} OFT.`
    );
  }
}

main()
  .then(() => console.log('Deployment complete'))
  .catch((error) => console.error('Error deploying contract:', error));
