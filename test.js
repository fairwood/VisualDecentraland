var Web3EthAbi = require('web3-eth-abi');
const BigNumber = require('bn.js');

var api = require('etherscan-api').init('E8Q1G2442V7FERC193MR9Y9XP825JZYFX9');

const clearLow = new BigNumber('ffffffffffffffffffffffffffffffff00000000000000000000000000000000', 16);
const clearHigh = new BigNumber('00000000000000000000000000000000ffffffffffffffffffffffffffffffff', 16);
const factor = new BigNumber('100000000000000000000000000000000', 16);

function uint(x) {
    x = new BigNumber(x);
    if (x.isNeg()) {
        let max = new BigNumber('10000000000000000000000000000000000000000000000000000000000000000', 16);
        return max.add(x);
    } else {
        return x;
    }
}
function int(x) {
    console.log('20--', x);//8fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff4ea
    let half = new BigNumber('8000000000000000000000000000000000000000000000000000000000000000', 16);
    if (x.gte(half)) {
        let max = new BigNumber('10000000000000000000000000000000000000000000000000000000000000000', 16);
        return x.sub(max);
    } else {
        return x;
    }
}

function encodeTokenId(x, y) {
    let enc = (new BigNumber(uint(x)).mul(factor).maskn(256).and(clearLow)).or(new BigNumber(uint(y)).and(clearHigh));
    return enc;
    // return ((uint(x) * factor) & clearLow) | (uint(y) & clearHigh);
}

function decodeTokenId(value) {
    let x = value.and(clearLow).shrn(128);
    let y = value.and(clearHigh);
    console.log(x, y);
    return [expandNegative128BitCast(x).toString(10), expandNegative128BitCast(y).toString(10)];
}

function expandNegative128BitCast(value) {
    if (!(value.and(new BigNumber(1).shln(127)).isZero())) {
        console.log('45**', value, clearLow, value.or(clearLow));
        return int(value.or(clearLow));
    }
    return int(value);
}

console.log(new BigNumber('115792089237316195423570985008687907853269984665640564039457584007913129639914').toString(16));
console.log(uint(-22).toString(16));
console.log(decodeTokenId(new BigNumber('ffffffffffffffffffffffffffffffea00000000000000000000000000000046', 16)));
// console.log(xy[0], xy[1]);
console.log(encodeTokenId(-22, 70).toString(16)); //fffffffffffffffffffffffffffff4ea00000000000000000000000000000046

//assetID to Auction
var contractAddress = '0xB3BCa6F5052c7e24726b44da7403b56A8A1b98f8';
var functionSignature = Web3EthAbi.encodeFunctionSignature('auctionByAssetId(uint256)');
console.log('functionSignature', functionSignature);

var i = 0;
for (var x = 50; x < 60; x++) { //-150~150
    for (var y = -12; y < -10; y++) {
        function call(x, y) {
            var assetID = encodeTokenId(x, y).toString(16, 64);
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
                let price = parseInt(priceStr, 16);
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