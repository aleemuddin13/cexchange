import axios, { AxiosInstance } from 'axios'
import { exec } from 'child_process'
import CryptoCoin from '../util/CrytoCoin';
import Order from '../util/Order';
import { OrderTypeEnum } from '../enums/index';
import Account from '../util/Account';
import ExchangeInterface from '../interfaces/ExchangeInterface';

declare const Buffer

const BASE_URL = 'https://tradesatoshi.com/api'

export default class Tradesatoshi implements ExchangeInterface {
    axiosInstance: AxiosInstance
    baseUrl: string
    apiKey: string
    secretKey: string

    constructor(obj?:object) {
        if (obj) {
            const objKeys = Object.keys(obj)
            for (const key of objKeys) {
                this[key] = obj[key]
            }
        }
        this.baseUrl = BASE_URL
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl
        })
        this.axiosInstance.interceptors.request.use(
            config => this.axiosInterceptor(config),
            error => Promise.reject(error)
        );
    }

    getHash(text: string) {
        return new Promise((resolve, reject) => {
            exec(`python ${__dirname}/../../shared/crypto.py ${this.secretKey} ${text}`, (error, data) => {
                if (error) {
                    return reject(error)
                }
                return resolve(data.trim())
            })
        })
    }

    async axiosInterceptor(config: any) {
        if (config.url.indexOf('public') !== -1) {
            return config
        }
        const nounce = new Date().getTime()
        const text = `${this.apiKey}POST${encodeURIComponent(config.baseURL + config.url).toLocaleLowerCase()}${nounce}${Buffer.from(JSON.stringify(config.data)).toString('base64')}`
        const hash = await this.getHash(text)
        const newConfig = config
        newConfig.headers.Authorization = `Basic ${this.apiKey}:${hash}:${nounce}`
        newConfig.headers['Content-Type'] = 'application/json; charset=utf-8'
        return newConfig
    }

    async getBalance(): Promise<Account> {
        const url = '/private/getbalance'
        const res = await this.axiosInstance.post(url, { Currency: 'DKD' })
        if (res.data.success !== true) {
            throw new Error('unable to fetch response')
        }
        const { result } = res.data
        const account =  new Account({ exchangeName: this.getExchangeName() });
        account.setBalance('dkd', Number(result.available))
        return account;
    }

    async getMyOrders(): Promise<any> {
        const url = '/private/getorders'
        const res = await this.axiosInstance.post(url, {})
        if (res.data.success !== true) {
            throw new Error('unable to fetch response')
        }
        const { result } = res.data
        console.log(result);
    }

    async cancelMyAllOrders(cryptocoin?: CryptoCoin): Promise<any> {
        if (!cryptocoin) {
            const url = '/private/cancelorder'
            const res = await this.axiosInstance.post(url, {
                Type: 'All'
            })
            return
        }

        const url = '/private/cancelorder'
        const res = await this.axiosInstance.post(url, {
            Type  : 'Market',
            Market: Tradesatoshi.getMarket(cryptocoin)
        })
    }

    async cancelMyOrder(id: any, cryptocoin?: CryptoCoin): Promise<any> {
        const url = '/private/cancelorder'
        const res = await this.axiosInstance.post(url, {
            Type   : 'Single',
            OrderId: id
        })
        console.log(res.data);
    }

    static getMarket(cryptocoin:CryptoCoin): string {
        switch (cryptocoin.priCoin) {
            case 'dkd': {
                return 'DKD_BTC'
            }
            default:
        }
        throw new Error('Method not implemented.');
    }

    async putOrder(order: Order): Promise<Order> {
        const url = '/private/submitorder'
        const res = await this.axiosInstance.post(url, {
            Market: Tradesatoshi.getMarket(order.cryptocoin),
            Type  : Tradesatoshi.getOrderType(order.type),
            Amount: order.volume,
            Price : order.price
        })
        const newOrder = order
        newOrder.id = res.data.result.orderId
        return newOrder
    }

    static getOrderType(type: OrderTypeEnum):string {
        switch (type) {
            case OrderTypeEnum.BUY: return 'Buy'
            case OrderTypeEnum.SELL: return 'Sell'
            default:
        }
        throw new Error('invalid type')
    }

    async getBuyOrders(cryptocoin: CryptoCoin): Promise<Order[]> {
        const url = `/public/getorderbook?market=${Tradesatoshi.getMarket(cryptocoin)}&type=buy`
        const res = await this.axiosInstance.get(url)
        const ordersList:[Order] = [new Order({ id: '1', type: 'SELL' })]
        ordersList.pop()
        for (const orderObj of res.data.result.buy) {
            ordersList.push(new Order({
                type  : OrderTypeEnum.BUY,
                volume: orderObj.quantity,
                price : orderObj.rate,
                cryptocoin
            }))
        }
        return ordersList
    }

    async getSellOrders(cryptocoin: CryptoCoin): Promise<Order[]> {
        const url = `/public/getorderbook?market=${Tradesatoshi.getMarket(cryptocoin)}&type=sell`
        const res = await this.axiosInstance.get(url)
        const ordersList: [Order] = [new Order({ id: '1', type: 'SELL' })]
        ordersList.pop()
        for (const orderObj of res.data.result.sell) {
            ordersList.push(new Order({
                type  : OrderTypeEnum.SELL,
                volume: orderObj.quantity,
                price : orderObj.rate,
                cryptocoin
            }))
        }
        return ordersList
    }

    async getOrders(cryptocoin:CryptoCoin):
        Promise<{ buyOrderList: Order[]; sellOrderList: Order[]; }> {
        const url = `/public/getorderbook?market=${Tradesatoshi.getMarket(cryptocoin)}&type=both`
        const res = await this.axiosInstance.get(url)

        const buyOrderList:Order[]   = []
        const sellOrderList: Order[] = []
        for (const orderObj of res.data.result.sell) {
            sellOrderList.push(new Order({
                type  : OrderTypeEnum.SELL,
                volume: Number(orderObj.quantity),
                price : Number(orderObj.rate),
                cryptocoin
            }))
        }
        for (const orderObj of res.data.result.buy) {
            buyOrderList.push(new Order({
                type  : OrderTypeEnum.BUY,
                volume: Number(orderObj.quantity),
                price : Number(orderObj.rate),
                cryptocoin
            }))
        }
        return { buyOrderList, sellOrderList }
    }

    toString() {
        return 'Exchange Name: Tradesatoshi'
    }

    getExchangeName(): string {
        return 'tradesatoshi'
    }
}
