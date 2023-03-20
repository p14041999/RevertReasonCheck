const Web3 = require("web3");
// const rpc = "https://xapi.cicscan.com";
const web3 = new Web3("https://xapi.cicscan.com");
const bignumber = require("bignumber.js");
const csv = require("csv-parser");
const tokenAbi = require("./tokenABI.json");
const batchABI = require("./batchABI.json");
const fs = require("fs");

// const { Console } = require("console");

require("dotenv").config();
const addresses = [];
let addresses2 = [];
async function main() {
  console.log("YO");
  await readFile();
}

async function readFile() {
  try {
    await fs
      .createReadStream("./CSV/addresses.csv")
      .pipe(csv())
      .on("data", async (data) => {
        addresses.push(data);
        // console.log("addresses",addresses)
        // console.log("addresses",addresses)
      })
      .on("end", async () => {
        // console.log(addresses)

        addresses2 = JSON.parse(
         await fs.readFileSync("./CSV/addresses2.json", "utf-8")
        );
        // console.log(addresses2)
        let arr = [];
        let newHolderAddress = addresses2.map(([address, amount]) => {
          arr.push(address);
          // console.log(address)
        });

        // sendBatch()
        // console.log("1",arr)
        // for (let i = 0; i < addresses.length; i++) {
        // console.log(arr);
        txns(0);
        // await approve(addresses[i].holderAddress)

        // if(arr.includes(holderAddress)){Y

        //     console.log("Working",i)

        // }else {
        //     console.log("holder ",holderAddress)
        // }

        // console.log(newHolderAddress)
        // }
      });
  } catch (error) {
    console.log(error);
  }
}

async function txns(i) {
  try {

    if (i < addresses.length) {
      // setTimeout(async () => {
      let holderAddress = addresses[i].holderAddress;
      // console.log("holderAddress", holderAddress);
      let balance = await getTokenBalance(holderAddress);
      let newBalance = await getNewTokenBalance(holderAddress);
      if ((Number(newBalance)- Number(balance))/10**18 > 1 ) {
        console.log(i)
        console.log("CHECK",holderAddress,(Number(newBalance) - Number(balance))/10**18);

        // let tx = await tokenTransfer(holderAddress, balance);
        // if (tx) {
        //   console.log("TXN COMPLETED SUCESSFULLY", i);
          txns(i+1);
          // }
        // } 
        
      }

      else {
        txns(i+1);
      }
        // }, 1000*i );
      
    }
  } catch (error) {
    console.log("Error : ", error);

    let log = {
      error :"TXN FAILED",
      address : addresses[i].holderAddress
    }
    let file = fs.readFileSync("./log.json", "utf-8");
    let data = JSON.stringify(log) + "\n" + file;
    await fs.writeFileSync("./log.json", data,'utf-8');

    const myLogger = new Console({
     
      stderr: fs.createWriteStream("errStdErr.txt"),
    });
    myLogger.error("Its an error",addresses[i].holderAddress);
  }
}



// async function sendBatch() {
//   try {
//     let batch = []
//     let holderAddress = addresses2.map(([address]) => {
//       batch.push(address);
//       // console.log(address)
//     });

//     console.log(batch)
//     let batchContract = "0xaC5BA47ebCa4aED68a5aeA3d75AA38D6a840Fd4A";

//     const contract = new web3.eth.Contract(batchABI, batchContract);

//     const batchSize = 6;
//     for (let i = 0; i < batch.length; i += batchSize) {
//       const batchAddresses = batch.slice(i, i + batchSize);
//       console.log("batch ",JSON.stringify(batchAddresses),i );

//     }
//   } catch (error) {
//     console.log("ERROR", error);
//   }
// }

// sendBatch();

// async function approve(address){

// try{
//   const  contract = new web3.eth.Contract(tokenAbi, process.env.PREV_TOKEN);

//   // let approve = await contract.methods.approve(address, "9999999999999999999999999999999999999").call()

//   let txObject = {
//     from: process.env.PUBLIC_KEY,
//     to: process.env.ELIX_TOKEN,
//     value: 0,
//     gasLimit: web3.utils.toHex(100000),
//     // nonce: ,
//     data: contract.methods.approve(address, "9999999999999999999999999999999999999").encodeABI(),
//   };

//   let signed = await web3.eth.accounts.signTransaction(
//     txObject,
//     process.env.PRIVATE_KEY
//   );
//   let response = await web3.eth.sendSignedTransaction(signed.rawTransaction);

//   console.log(response)
// }
// catch (error){
//   console.log(error)
// }
// }

async function getTokenBalance(walletAddress) {
  try {
    let contract = new web3.eth.Contract(tokenAbi, process.env.PREV_TOKEN);
    let result = await contract.methods.balanceOf(walletAddress).call();
    // console.log("Token", result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function getNewTokenBalance(walletAddress) {
  try {
    let contract = new web3.eth.Contract(tokenAbi, process.env.ELIX_TOKEN);
    let result = await contract.methods.balanceOf(walletAddress).call();
    // console.log("Token", result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function tokenTransfer(toAddress, amount) {
  try {
    console.log(typeof(toAddress))
    let contract = new web3.eth.Contract(tokenAbi, process.env.ELIX_TOKEN);
    let nonce = await web3.eth.getTransactionCount(process.env.PUBLIC_KEY);
    let txObject = {
      from: process.env.PUBLIC_KEY,
      to: process.env.ELIX_TOKEN,
      value: 0,
      gasLimit: web3.utils.toHex(1000000),
      nonce: nonce,
      data: contract.methods.transfer(toAddress, amount.toString()).encodeABI(),
    };

    let signed = await web3.eth.accounts.signTransaction(
      txObject,
      process.env.PRIVATE_KEY
    );
    let response = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log("res", response);
    if (!response) await tokenTransfer(toAddress, amount);
    else return response;
  } catch (error) {
    console.log(error);
    await tokenTransfer(toAddress, amount);
  }
}

main();

// tokenTransfer("0x583fd96b91E5B70AFDD124C7497AE6B0cd09F773",100)
module.exports = main;

// 16000002240000000000000