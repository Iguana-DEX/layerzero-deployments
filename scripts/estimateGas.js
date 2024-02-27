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

function formatBytes32String(bytes20String) {
  const bytes32String =
    '0x' + '0'.repeat(24) + bytes20String.substring(2, bytes20String.length);
  return bytes32String;
}

async function main() {
  const ignTokenDeployments = {
    etherlinkTestnet: etherlinkTestnetDeployments.IGNToken,
    bscTestnet: bscTestnetDeployments.IGNToken,
  };
  const [ owner ] = await hre.ethers.getSigners();

  console.log(
    `Calling Estimate gas before send on your ${networkName} OFT for ${targetNetworkName} network. ${formatBytes32String(owner.address)}`
  );

  const Token = await hre.ethers.getContractFactory('IGNToken');
  const token = Token.attach(ignTokenDeployments[networkName]);

  // Estimate gas
  const sendParam = {
    dstEid: endpointIds[targetNetworkName], // Destination endpoint ID.
    to: formatBytes32String(owner.address), // Recipient address.
    amountLD: hre.ethers.utils.parseEther("1"), // Amount to send in local decimals.
    minAmountLD: 0, // Minimum amount to send in local decimals.
    extraOptions: "0x00030100110100000000000000000000000000030d40", // Additional options supplied by the caller to be used in the LayerZero message.
    composeMsg: "0x", // The composed message for the send() operation.
    oftCmd: "0x", // The OFT command to be executed, unused in default OFT implementations.
  };
  const estimatedGas = await token.quoteSend(
    sendParam,
    false // do we want to pay in lz token
  );

  console.log(`Your send is estimated at ${estimatedGas.nativeFee} gas amount in native gas token and ${estimatedGas.lzTokenFee} gas amount in ZRO token.`);
}

main()
  .then(() => console.log('Deployment complete'))
  .catch((error) => console.error('Error deploying contract:', error));
