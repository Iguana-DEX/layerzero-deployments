# 🦎 IguanaDEX Ethers v5 LayerZero deployment repo

<p align="center">
  <a href="https://iguanadex.com">
      <img src="https://i.postimg.cc/X73GL1y8/Cute-Iguana-no-bg.webp" height="500">
  </a>
</p>

This repository contains the source code for the [Iguana token](https://iguanadex.com) along with various other non-core contracts.

Make sure you use version 18 or higher for node.js
The repo uses npm for the management of packages/dependencies.

### 1) Update the .env.example file

- rename to .env (will be gitignored)
- fetch api key from bscscan (same key for testnet version)
- Etherscout is Etherlink's explorer. The key is ignored so XYZ is fine.

### 2) Prepare the repo and the dependencies

```sh
npm install
```

### 3) Prepare the repo and the dependencies

The below command will compile any contract if needed before deployment.

```sh
npx hardhat run --network etherlinkTestnet scripts/deploy.js
```

You will find the DEPLOYED_CONTRACT_ADDRESS of the contract you just deployed in the
'deployments' folder in addition to the command line.

### 4) Finally, verify the contract on the referenced explorer

```sh
npx hardhat verify --network etherlinkTestnet --constructor-args scripts/deployArgs.js DEPLOYED_CONTRACT_ADDRESS
```
