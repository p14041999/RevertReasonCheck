const Web3 = require("web3");
// const rpc = "https://xapi.cicscan.com";
const web3 = new Web3("https://xapi.cicscan.com");

web3.extend({
    property: 'debug',
    methods: [{
        name: 'traceTransaction',
        call: "debug_traceTransaction",
        params: 2,
        
    }]
});

async function test(){
  try{
    const debug = await  web3.debug.traceTransaction("0x2dbe5c142a262ca2a14a6ea86a91e2af5787dd22ec29c053bf4fc508d517b98e",{ tracer: 'callTracer' })
    console.log(debug)
  }catch(error){
    console.log(error)
  }

}


console.log(
    web3.utils.hexToUtf8("0x537761704c6962726172793a20494e53554646494349454e545f4c49515549444954590000000000000000000000000000000000000000000000000000000000"))
test()

// 08c379a0
// 0000000000000000000000000000000000000000000000000000000000000020
// 0000000000000000000000000000000000000000000000000000000000000023
// 537761704c6962726172793a20494e53554646494349454e545f4c4951554944
// 4954590000000000000000000000000000000000000000000000000000000000