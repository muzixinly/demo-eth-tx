const Web3 = require("web3");

// Loading the contract ABI
// (the results of a previous compilation step)
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("STC.json"));

async function main() {
  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
      new Web3.providers.HttpProvider(
          `https://${network}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
  );
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
      process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  // Creating a Contract instance
  const contract = new web3.eth.Contract(
      abi,
      // Replace this with the address of your deployed contract
      process.env.STC_CONTRACT
  );

  const to = process.env.RECEIVER_ADDRESS;
  const amount = 350000;
  const payload = {
    from: process.env.STC_OWNER_ADDREDD,
    // Address of the contract we want to call
    to: process.env.STC_CONTRACT,
    // Encoded data payload representing the contract method call
    // data: iface.encodeFunctionData("echo", [`Hello world at ${Date.now()}!`]),
    data: contract.methods.depositeFromStarcoinChain(to, amount).encodeABI(),
    // An upper limit on the gas we're willing to spend
    // gas: "1250000",
    // gas: "0x6978", // 27000
    gasPrice: "0x6fc23ac00", //30Gwei
  };
  payload.gas = await web3.eth.estimateGas(payload);
  console.log(`payload.data ... ${payload.data}`);

  // const signedData = await web3.eth
  //     .signTransaction(payload, process.env.STC_OWNER_ADDREDD);
      // .then(console.log);
      // .once("transactionHash", (txhash) => {
      //   console.log(`Mining transaction ...`);
      //   console.log(`https://${network}.etherscan.io/tx/${txhash}`);
      // });
  // const signedData = await web3.eth.signTransaction(payload)
  // console.log(`signedData ... ${signedData}`);

  // web3.eth.signTransaction({
  //   from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0",
  //   gasPrice: "20000000000",
  //   gas: "21000",
  //   to: '0x3535353535353535353535353535353535353535',
  //   value: "1000000000000000000",
  //   data: ""
  // }).then(console.log);

  // web3.eth.signTransaction(payload, process.env.STC_OWNER_ADDREDD).then(console.log);

  const signedData = await web3.eth.accounts.signTransaction(payload, process.env.SIGNER_PRIVATE_KEY);
  console.log(`signedData ... ${signedData.rawTransaction}`);


//   const receipt = await tx
//       .send({
//         from: signer.address,
//         gas: await tx.estimateGas(),
//       })
//       .once("transactionHash", (txhash) => {
//         console.log(`Mining transaction ...`);
//         console.log(`https://${network}.etherscan.io/tx/${txhash}`);
//       });
//   // The transaction is now on chain!
//   console.log(`Mined in block ${receipt.blockNumber}`);
}

require("dotenv").config();
main();
