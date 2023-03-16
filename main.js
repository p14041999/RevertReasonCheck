const Web3 = require("web3");
// const rpc = "https://xapi.cicscan.com";
const web3 = new Web3("https://xapi.cicscan.com");
const bignumber = require("bignumber.js");
const csv = require("csv-parser");
const tokenAbi = require("./tokenABI.json");
const fs = require("fs");

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
          fs.readFileSync("./CSV/addresses2.json", "utf-8")
        );
        // console.log(addresses2)
        let arr = [];
        let newHolderAddress = addresses2.map(([address, amount]) => {
          arr.push(address);
          // console.log(address)
        });
        // console.log("1",arr)
        // for (let i = 0; i < addresses.length; i++) {
          // console.log(arr)
          txns(0)
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

async function txns(i){
   try{
    if(i<addresses.length){
      setTimeout(async () => {
        let holderAddress = addresses[i].holderAddress;
        console.log("holderAddress",holderAddress)
        let balance = await getTokenBalance(holderAddress);
        let newBalance = await getNewTokenBalance(holderAddress);
    
        if (balance > 0 && balance != newBalance) {
          console.log("Working");
    
          let tx = await tokenTransfer(holderAddress, balance);
          if (tx) {
            console.log("TXN COMPLETED SUCESSFULLY");
            txns(i+1)
          }
        }else {
          txns(i+1)
        }
       
      }, 10000 *i );
    
    }
    
   }catch(error){
    console.log(error)
   }

}



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
    console.log("Token", result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function getNewTokenBalance(walletAddress) {
  try {
    let contract = new web3.eth.Contract(tokenAbi, process.env.ELIX_TOKEN);
    let result = await contract.methods.balanceOf(walletAddress).call();
    console.log("Token", result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function tokenTransfer(toAddress, amount) {
  try {
    // console.log(typeof(toAddress))
    let contract = new web3.eth.Contract(tokenAbi, process.env.ELIX_TOKEN);
    let nonce = await web3.eth.getTransactionCount(process.env.PUBLIC_KEY)
    let txObject = {
      from: process.env.PUBLIC_KEY,
      to: process.env.ELIX_TOKEN,
      value: 0,
      gasLimit: web3.utils.toHex(20000000),
      nonce: nonce ,
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
