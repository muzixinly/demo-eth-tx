const { ethers } = require("ethers");

async function main() {
  // Loading the contract ABI
  // (the results of a previous compilation step)
  const fs = require("fs");
  const { abi } = JSON.parse(fs.readFileSync("Demo.json"));

  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
  const provider = new ethers.providers.InfuraProvider(
    network,
    process.env.INFURA_PROJECT_ID
  );

  // Creating a signing account from a private key
  const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY, provider);

  // Create a contract interface
  const iface = new ethers.utils.Interface(abi);

  // Create the transaction payload request
  const payload = {
    // Address of the contract we want to call
    to: process.env.RECEIVER_ADDRESS,
    // Encoded data payload representing the contract method call
    // data: iface.encodeFunctionData("echo", [`Hello world at ${Date.now()}!`]),
    data: iface.encodeFunctionData("echo", [`Hello world at !`]),
    // An upper limit on the gas we're willing to spend
    // gas: "50000",
  };

// Signing a transaction
//  const signedData = await signer.signTransaction(payload);
//  console.log(`signedData ... {signedData}`);
 const tx = await signer.sendTransaction(payload);

  // // Creating and sending the transaction object
  // const tx = await signer.sendTransaction({
  //   to: process.env.DEMO_CONTRACT,
  //   gasPrice: 10000000000,  // 指定gas price
  //   gas: 250000 ,           // 指定gas值
  //   value: ethers.utils.parseUnits("0.0001", "ether"),
  // });
  console.log("Mining transaction...");
  console.log(`https://${network}.etherscan.io/tx/${tx.hash}`);
  // Waiting for the transaction to be mined
  const receipt = await tx.wait();
  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);
}

require("dotenv").config();
main();


