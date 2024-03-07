const etherlinkTestnetDeployments = require('../deployments/etherlinkTestnet.json');
const bscTestnetDeployments = require('../deployments/bscTestnet.json');
const polygonMumbaiDeployments = require('../deployments/polygonMumbai.json');
const hre = require('hardhat');
const LZUtilities = require('@layerzerolabs/lz-v2-utilities'); // Error: bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)

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
    polygonMumbai: polygonMumbaiDeployments.IGNToken,
  };
  const [ owner ] = await hre.ethers.getSigners(); 

  console.log(
    `Calling Estimate gas before send on your ${networkName} OFT to ${targetNetworkName} network.`
  );

  const Token = await hre.ethers.getContractFactory('IGNToken');
  const token = Token.attach(ignTokenDeployments[networkName]);

  // Calculate options
  let extraOptions;
  if (targetNetworkName == "etherlinkTestnet") {
    // If etherlink, use a lot of gas
    const option = LZUtilities.Options.newOptions().addExecutorLzReceiveOption(hre.ethers.utils.formatUnits(41000000, "wei"), 0);
    extraOptions = option.toHex();
  } else {
    // If classic EVM, use 200000 wei (recommended by documentation)
    extraOptions = "0x00030100110100000000000000000000000000030d40";
  }

  // Estimate gas
  const sendParam = {
    dstEid: endpointIds[targetNetworkName], // Destination endpoint ID.
    to: formatBytes32String(owner.address), // Recipient address.
    amountLD: hre.ethers.utils.parseEther("1"), // Amount to send in local decimals.
    minAmountLD: 0, // Minimum amount to send in local decimals.
    extraOptions: extraOptions, // Additional options supplied by the caller to be used in the LayerZero message.
    composeMsg: "0x", // The composed message for the send() operation.
    oftCmd: "0x", // The OFT command to be executed, unused in default OFT implementations.
  };
  const estimatedGas = await token.quoteSend(
    sendParam,
    false // do we want to pay in lz token
  );

  console.log(`Your send is estimated at ${estimatedGas.nativeFee} gas amount in native gas token and ${estimatedGas.lzTokenFee} gas amount in ZRO token.`);

  console.log(`Sending the tokens from ${networkName} to ${targetNetworkName}...`);

  // Send tokens
  const tx = await token.send(
    sendParam,
    estimatedGas, // messaging fee
    owner.address, // refund address
    {value: estimatedGas.nativeFee}
  );

  console.log(`See the token transfer here: https://testnet.layerzeroscan.com/tx/${tx.hash}`)
}

main()
  .then(() => console.log('Transaction complete'))
  .catch((error) => console.error('Error deploying contract:', error));
