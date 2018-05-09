import OrderInterface from '../interfaces/OrderInterface';
import { OrderTypeEnum } from '../enums';
import CryptoCoin from './CrytoCoin';

export default class Order implements OrderInterface {
    id: any;
    type: OrderTypeEnum;
    volume: number;
    price: number;
    cryptocoin: CryptoCoin;

    constructor(obj?) {
        const objKeys = Object.keys(obj)
        for (const key of objKeys) {
            this[key] = obj[key]
        }
        if (!(this.type in OrderTypeEnum)) {
            throw new Error('invalid type')
        }
    }

    toString() {
        return `volume: ${this.volume}, price:${this.price}`
    }
}
