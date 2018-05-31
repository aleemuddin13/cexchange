import CryptoCoin from '../../src/util/CrytoCoin';

export default class Ticker {
    ask: Number
    bid: Number
    last: Number
    cryptocoin: CryptoCoin
    askVolume: Number
    bidVolume: Number
    constructor(obj: object) {
        const objKeys = Object.keys(obj)
        for (const key of objKeys) {
            this[key] = obj[key]
        }
    }
}
