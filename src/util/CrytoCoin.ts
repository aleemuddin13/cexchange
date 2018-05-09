import CryptoCoinInterface from '../interfaces/CryptoCoinInterface';
import { Currency } from '../enums';

export default class CryptoCoin implements CryptoCoinInterface {
    priCoin: Currency;
    secCoin: Currency;
    constructor(priCoin: Currency, secCoin: Currency) {
        this.priCoin = priCoin
        this.secCoin = secCoin
    }
}
