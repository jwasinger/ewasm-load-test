const GenerateTest = require('./ewasm-testgen/index.js')
const Web3 = require('web3')
const Async = require('async')
const argv = require('yargs').option("faucet", {string: true}).argv

if ( !argv.faucet)
  throw("error: must provide faucet private address")

let faucetPk = argv.faucet

if ( !argv['rpc-endpoint'] )
  throw("error: must provide rpc endpoint")

let endpoint = argv['rpc-endpoint']

let createAccounts = async (num) => {
  for (let i = 0; i < num; i++ ) {
    let txn = {
      from: faucet,
      to: '',
      value: 0x1333333337,
    }

    web3.eth.sendRawTransaction(txn, function(err, hash) {
      if (err) throw(err)
      let startBlockNumber = web3.eth.BlockNumber()

      SetInterval( function() {
        web3.eth.getBlock("latest", (e, block) {
          if (e) throw(e)
          if (block.transactions.indexOf(hash) != -1) {
            console.log(hash, " was included!");
          }
        })
      }, 100)
    })


  }
}

let doTxn = (task, callback) => {
  let start = Date.now();

  web3.eth.estimateGas({

  })

  let elapsedEstimateGas = Date.now() - start
  start = Date.now()

  web3.sendTransaction({

  })

  let elapsedTx = Date.now() - start;
  start = Date.now()
}

let web3 = new Web3(new Web3.providers.HttpProvider(endpoint))
let queue = Async.queue(doTxn, 2)

setInterval(() => {
  let wast = GenerateTest()

  queue.push(wast, (err) => {
    if (err) console.log(err)
    //TODO gather results
  })
}, 1000/7)
