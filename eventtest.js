var Web3EthAbi = require('web3-eth-abi');
const BigNumber = require('bn.js');
var util = require('./util');

var api = require('etherscan-api').init('E8Q1G2442V7FERC193MR9Y9XP825JZYFX9');

var getLogs = api.log.getLogs('0xb3bca6f5052c7e24726b44da7403b56a8a1b98f8',
    5509000,
    'latest',
    '0x9493ae82b9872af74473effb9d302efba34e0df360a99cc5e577cd3f28e3cab2'
);

getLogs.then(function(data) {
    let result = data.result;
    console.log(data.result);
    let topics = result[0].topics;
    let data2 = result[0].data;
    console.log('======', data2);
    console.log(util.decodeTokenId(new BigNumber(topics[1], 16)));
    console.log(new BigNumber(data2.substr(2+64, 64), 16).div(new BigNumber('1000000000000000000')).toString(10));
});

/*
https://api.etherscan.io/api?module=logs&action=getLogs
&fromBlock=5505000
&toBlock=latest
&address=0xb3bca6f5052c7e24726b44da7403b56a8a1b98f8
&topic0=0x9493ae82b9872af74473effb9d302efba34e0df360a99cc5e577cd3f28e3cab2
&apikey=YourApiKeyToken
*/

/*
    address: '0xb3bca6f5052c7e24726b44da7403b56a8a1b98f8',
       topics: [Array],
       data: '
    0x
    c8407c3e95270c154965ddfc33cdd5f93d5f269abc1fe8bff28bfda58adba469
    000000000000000000000000000000000000000000000a604b9a42df9ca00000
    0000000000000000000000000000000000000000000000000000016399beac00',
       blockNumber: '0x540193',
       timeStamp: '0x5ae0f467',
       gasPrice: '0xb2d05e00',
       gasUsed: '0x1d0ff',
       logIndex: '0xa',
       transactionHash: '0x5b601b8b1e09f923a8f00ebc90b0349546e53f793146c3f5cfc28b69d4b6ff9d',
       transactionIndex: '0xe' }
*/