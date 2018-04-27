const BigNumber = require('bn.js');

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
    return [expandNegative128BitCast(x).toString(10), expandNegative128BitCast(y).toString(10)];
}

function expandNegative128BitCast(value) {
    if (!(value.and(new BigNumber(1).shln(127)).isZero())) {
        return int(value.or(clearLow));
    }
    return int(value);
}

module.exports = {
    uint: uint,
    int: int,
    encodeTokenId: encodeTokenId,
    decodeTokenId: decodeTokenId,
};