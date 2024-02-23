// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { writeFileSync } = require('fs');
const hre = require('hardhat');

const endpointIds = {
  sepolia: '40161',
  bscTestnet: '40102',
  avalancheFujiTestnet: '40106',
  polygonMumbai: '40109',
  arbitrumSepolia: '40231',
  optimismSepolia: '40232',
  etherlinkTestnet: '10239',
  mainnet: '30101',
  bsc: '30102',
  avalanche: '30106',
  polygon: '30109',
  arbitrumOne: '30110',
  optimisticEthereum: '30111',
};

const lzEndpointAddresses = {
  sepolia: '0x6edce65403992e310a62460808c4b910d972f10f',
  bscTestnet: '0x6edce65403992e310a62460808c4b910d972f10f',
  avalancheFujiTestnet: '0x6edce65403992e310a62460808c4b910d972f10f',
  polygonMumbai: '0x6edce65403992e310a62460808c4b910d972f10f',
  arbitrumSepolia: '0x6edce65403992e310a62460808c4b910d972f10f',
  optimismSepolia: '0x6edce65403992e310a62460808c4b910d972f10f',
  etherlinkTestnet: '0x2cA20802fd1Fd9649bA8Aa7E50F0C82b479f35fe',
  mainnet: '0x1a44076050125825900e736c501f859c50fe728c',
  bsc: '0x1a44076050125825900e736c501f859c50fe728c',
  avalanche: '0x1a44076050125825900e736c501f859c50fe728c',
  polygon: '0x1a44076050125825900e736c501f859c50fe728c',
  arbitrumOne: '0x1a44076050125825900e736c501f859c50fe728c',
  optimisticEthereum: '0x1a44076050125825900e736c501f859c50fe728c',
};

async function main() {
  const name = 'Iguana Token';
  const symbol = 'IGN';
  const lzEndpointAddress = lzEndpointAddresses[networkName];
  const owner = '0x7a2d40F9c3B4c5ff1f6a7549E24aaA3F94c1b3BE'; // DevAccount

  const networkName = hre.network.name;
  console.log('Network name: ' + networkName);

  const Token = await hre.ethers.getContractFactory('IGNToken');

  // const overrides = {
  //   gasPrice: 100000000000, // Can set this >= to the number read from Ganache window
  //   gasLimit: 6721975, // Use the same gasLimit as read from Ganache window (or a bit higher if still having issue)
  // };
  const token = await Token.deploy(
    name,
    symbol,
    lzEndpointAddress,
    owner
    // overrides
  );

  const tokenAddress = await token.address;
  const tokenSymbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  const decimals = await token.decimals();
  const formattedTotalSupply = totalSupply / (10 ** decimals).toString();

  console.log(
    `${tokenSymbol} token deployed at ${tokenAddress} with ${formattedTotalSupply} total supply.`
  );

  // Write the address to a file.
  writeFileSync(
    `./deployments/${networkName}.json`,
    JSON.stringify(
      {
        IGNToken: tokenAddress,
      },
      null,
      2
    )
  );
}

main()
  .then(() => console.log('Deployment complete'))
  .catch((error) => console.error('Error deploying contract:', error));
