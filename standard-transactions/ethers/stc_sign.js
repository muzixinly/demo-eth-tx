const { ethers } = require("ethers");

async function main() {
  // Loading the contract ABI
  // (the results of a previous compilation step)
  const fs = require("fs");
  const { abi } = JSON.parse(fs.readFileSync("STC.json"));

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


  // {
  //   "from": "0x71DFDD2BF49E8Af5226E0078efA31ecf258bC44E",
  //     "to": "0x778be54f81a9f72d4504c95b40f0e7675ee53e19",
  //     "gas": "0x76c0",
  //     "gasPrice": "0x9184e72a000",
  //     "value": "0x9184e72a",
  //     "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
  // }
  // Create the transaction payload request
  const to = process.env.RECEIVER_ADDRESS;
  const amount = 350000;
  const payload = {
    from: process.env.STC_OWNER_ADDREDD,
    // Address of the contract we want to call
    to: process.env.STC_CONTRACT,
    // Encoded data payload representing the contract method call
    // data: iface.encodeFunctionData("echo", [`Hello world at ${Date.now()}!`]),
    data: iface.encodeFunctionData("depositeFromStarcoinChain", [to, amount]),
    // An upper limit on the gas we're willing to spend
    // gas: "1250000",
    gasLimit: 1240000,
    gasPrice: "0x9184e72a000",
  };
  // function depositeFromStarcoinChain(address to, uint256 amount) onlyOwner public virtual override returns (bool) {
  console.log(`payload.data ... ${payload.data}`);
  //踩坑，ether的payload里gas参数名为gasLimit，和标准的gas名不一致，导致签名的消息在标准的JsonRPC中无法执行。

// Signing a transaction
 const signedData = await signer.signTransaction(payload);
 console.log(`signedData ... ${signedData}`);
//  const tx = await signer.sendTransaction(signedData);
// // '0xf865808080948ba1f109551bd432803012645ac136ddd64dba72880de0b6b3a7640000801ca0918e294306d177ab7bd664f5e141436563854ebe0a3e523b9690b4922bbb52b8a01181612cec9c431c4257a79b8c9f0c980a2c49bb5a0e6ac52949163eeb565dfc'
//
//   // // Creating and sending the transaction object
//   // const tx = await signer.sendTransaction({
//   //   to: process.env.DEMO_CONTRACT,
//   //   gasPrice: 10000000000,  // 指定gas price
//   //   gas: 250000 ,           // 指定gas值
//   //   value: ethers.utils.parseUnits("0.0001", "ether"),
//   // });
//   console.log("Mining transaction...");
//   console.log(`https://${network}.etherscan.io/tx/${tx.hash}`);
//   // Waiting for the transaction to be mined
//   const receipt = await tx.wait();
//   // The transaction is now on chain!
//   console.log(`Mined in block ${receipt.blockNumber}`);
}

require("dotenv").config();
main();


