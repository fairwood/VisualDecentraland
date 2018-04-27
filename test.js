// import $ from './util';

var Web3EthAbi = require('web3-eth-abi');
const BigNumber = require('bn.js');
var util = require('./util');

var api = require('etherscan-api').init('E8Q1G2442V7FERC193MR9Y9XP825JZYFX9');

//assetID to Auction
var contractAddress = '0xB3BCa6F5052c7e24726b44da7403b56A8A1b98f8';
var functionSignature = Web3EthAbi.encodeFunctionSignature('auctionByAssetId(uint256)');
console.log('functionSignature', functionSignature);

var i = 0;
for (var x = 50; x < 60; x++) { //-150~150
    for (var y = -12; y < -10; y++) {
        function call(x, y) {
            var assetID = util.encodeTokenId(x, y).toString(16, 64);
            var callABI = functionSignature + assetID;

            var eth_call = api.proxy.eth_call(
                contractAddress,
                callABI,
                'latest'
            );
            eth_call.then(function (data) {
                // console.log('eth_call data', data);
                /* Auction:
                  0x9a83c7d07ef70d41f3d205e3927510b832f145af1298ca2ffa6355dfe1e6e95d
                    000000000000000000000000447c69f53d50bc4bc491e5613437983b6d969449
                    0000000000000000000000000000000000000000000002c0bb3dd30c4e200000
                    000000000000000000000000000000000000000000000000000001643e8a2c00 */
                let priceStr = data.result.substr(2 + 64 + 64, 64);
                let price = new BigNumber(priceStr, 16);
                console.log('(' + x + ',' + y + ')', price / 1e18);
            });
        }
        setTimeout(call, i * 250, x, y);
        i++;
    }
}




/*

  function encodeTokenId(int x, int y) view public returns (uint) {
    return ((uint(x) * factor) & clearLow) | (uint(y) & clearHigh);
  }

  function decodeTokenId(uint value) view public returns (int, int) {
    uint x = (value & clearLow) >> 128;
    uint y = (value & clearHigh);
    return (expandNegative128BitCast(x), expandNegative128BitCast(y));
  }

  function expandNegative128BitCast(uint value) pure internal returns (int) {
    if (value & (1<<127) != 0) {
      return int(value | clearLow);
    }
    return int(value);
  }
  */