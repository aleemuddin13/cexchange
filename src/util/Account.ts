import ExchangeInterface from '../interfaces/ExchangeInterface';

export default class Account {
    exchangeName: string
    exchange: ExchangeInterface
    constructor(obj: object) {
        const objKeys = Object.keys(obj)
        for (const key of objKeys) {
            this[key] = obj[key]
        }
    }
    setBalance(coin: string, amount: number) {
        this[coin] = amount
    }
    getBalance(coin: string): number {
        return this[coin] || 0;
    }
    getExchangeName():string {
        return this.exchangeName
    }
}
