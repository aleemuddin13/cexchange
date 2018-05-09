import { OrderTypeEnum } from '../enums/';
import CryptoCoin from '../util/CrytoCoin';

export default interface OrderInterface{
    id: any
    type: OrderTypeEnum
    volume: number
    price: number
    cryptocoin: CryptoCoin
}
