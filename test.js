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
    const debug = await  web3.debug.traceTransaction("0x9968e076d19fdfce81eea198e0a112de0ebcaf4390cc86bd3651c00e10e93772",{ tracer: 'callTracer' })
    console.log(debug)
    if(debug.error && debug.error == "execution reverted"){
      // let output = "";
      let output = debug.output;
      let StringCOntent = output.slice(138,output.length);
      let revertReason = web3.utils.hexToUtf8("0x"+StringCOntent);
      console.log(revertReason);
    }
  }catch(error){
    console.log(error)
  }

}


// console.log(
//     web3.utils.hexToUtf8("0x45524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e6365"))
test()


// 08c379a0
// 0000000000000000000000000000000000000000000000000000000000000020
// 0000000000000000000000000000000000000000000000000000000000000026
// 45524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e63650000000000000000000000000000000000000000000000000000