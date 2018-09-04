const GenerateTest = require('./ewasm-testgen/index.js')
const Web3 = require('web3')
const Async = require('async')
const Tx = require('ethereumjs-tx')
const Util = require('ethereumjs-util')
const argv = require('yargs').option("faucet", {string: true}).argv

if ( !argv.faucet)
  throw("error: must provide faucet private address")

let faucetPk = Buffer.from(argv.faucet, 'hex')

let faucetAddr = Util.privateToAddress(faucetPk).toString('hex')
console.log(faucetAddr)

if ( !argv['rpc-endpoint'] )
  throw("error: must provide rpc endpoint")

let endpoint = argv['rpc-endpoint']

let createAccounts = async (num) => {
  let promise = new Promise((resolve, reject) => {
    Async.mapSeries([...Array(num).keys()], (item, callback) => {
      web3.eth.getTransactionCount(faucetAddr).then((nonce) => {
        let txn = {
          from: faucetAddr,
          gasLimit: '0x27100',
          to: '',
          value: '0x1333333337',
          data: '',
          nonce: nonce.toString()
        }
        
        console.log(JSON.stringify(txn))
        debugger

        txn = new Tx(txn)
        txn.sign(faucetPk)

        web3.eth.sendSignedTransaction('0x'+txn.serialize().toString('hex'), function(err, hash) {
          if (err) throw(err)
          debugger
          let startBlockNumber = web3.eth.BlockNumber()

          SetInterval( function() {
            web3.eth.getBlock("latest", (e, block) => {
              if (e) throw(e)

              if (block.transactions.indexOf(hash) != -1) {
                console.log(hash, " was included!");
                callback(null, hash)
              }
            })
          }, 100)
        })
      }).catch((error) => {
        callback(error, null)
      })
    }, (err, results) => {
      resolve(null)
      debugger
    })
  })

  return promise
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

createAccounts(2)
  .then((results) => {
    setInterval(() => {
      let wast = GenerateTest()

      queue.push(wast, (err) => {
        if (err) console.log(err)
        //TODO gather results
      })
    }, 1000/7)
  })
