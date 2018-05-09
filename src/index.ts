import Exchanges from './Exchanges';
import ExchangeInterface from './Interfaces/ExchangeInterface';

const ExchangeList = Object.keys(Exchanges)

class Cexchange {
    constructor() {
        for (const exchange of ExchangeList) {
            this[exchange] = Exchanges[exchange]
        }
    }
    static getNewCexchange(): Cexchange {
        return new Cexchange()
    }
    getExchange(name:string, obj?: object):ExchangeInterface {
        if (!this[name]) {
            for (const exchange of ExchangeList) {
                if (exchange.toLocaleLowerCase() === name) {
                    this[name] = new Exchanges[exchange]()
                    return this[name]
                }
            }
        }
        throw new Error('Invalid exchange name')
    }
}

const cexchange = new Cexchange()

module.exports = cexchange
