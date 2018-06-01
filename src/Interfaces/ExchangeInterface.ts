import CryptoCoin from '../util/CrytoCoin';
import Order from '../util/Order';
import { OrderTypeEnum } from '../enums';
import Account from '../util/Account';
import Ticker from '../util/Ticker';

export default interface ExchangeInterface {
    getBalance(cryptocoin?: CryptoCoin): Promise<Account>
    getMyOrders(): Promise<any>
    cancelMyAllOrders(cryptocoin?: CryptoCoin): Promise<any>
    cancelMyOrder(id: any, cryptocoin?: CryptoCoin): Promise<any>
    putOrder(order: Order): Promise<Order>
    getBuyOrders(cryptocoin: CryptoCoin): Promise<Order[]>
    getSellOrders(cryptocoin: CryptoCoin): Promise<Order[]>
    getOrders(cryptocoin: CryptoCoin): Promise<{ buyOrderList: Order[], sellOrderList: Order[] }>
    getTicker(cryptocoin?: CryptoCoin, withVolume?: Boolean): Promise<Ticker>
    toString(): string
    getExchangeName(): string
    // placeOrder()
}
