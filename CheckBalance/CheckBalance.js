const Web3 = require("web3");
// const rpc = "https://xapi.cicscan.com";
const web3 = new Web3("https://xapi.cicscan.com");
const BigNumber = require("bignumber.js");
const csv = require("csv-parser");
const tokenAbi = require("../tokenABI.json");
const batchABI = require("../batchABI.json");
const fs = require("fs");

require("dotenv").config();
const addresses = [];
let addresses2 = [];

let totalBalance = BigNumber(0);
let totalDiff = BigNumber(0);

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
        addresses2.map(([address, amount]) => {
          arr.push(address);
        });
        CheckBalanceAndAdd(arr);
      });
  } catch (error) {
    console.log(error);
  }
}

function CheckBalanceAndAdd(addresses){
    recurring(0,addresses).then(()=>{
        console.log("hii",totalBalance.toFixed(),totalDiff.toFixed());
    })
            
}


async function getBalanceOf(address,tokenAddress){
    let token = new web3.eth.Contract(tokenAbi,tokenAddress);
    let balance = await token.methods.balanceOf(address).call();
    // console.log(BigNumber(balance).dividedBy(10**18).toFixed(4));
    return BigNumber(balance)
}
async function recurring(i,addresses){
    try{
        console.log(i);
        let balance = await getBalanceOf(addresses[i],process.env.PREV_TOKEN);
        let newBalance = await getBalanceOf(addresses[i],process.env.ELIX_TOKEN);
        if(balance){
            console.log(balance.plus(totalBalance).toFixed())
            totalBalance  = totalBalance.plus(balance);
            let difference  = newBalance.minus(balance);
            if(difference.isGreaterThan(0)){
                totalDiff = totalDiff.plus(difference)
            }
            // arr.push(totalBalance)
            // console.log((i+1),totalBalance.dividedBy(10**18).toFixed(4),totalDiff.dividedBy(10**18).toFixed(4));
            recurring(i+1,addresses);
        }
        }catch(e){
            console.log(e);
        }
}
main();
