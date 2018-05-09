import axios, { AxiosInstance } from 'axios'
import * as crypto from 'crypto-js';
import CryptoCoin from '../util/CrytoCoin';
import Order from '../util/Order';
import { OrderTypeEnum } from '../enums';
import Account from '../util/Account';
import { Currency } from '../enums/index';
import ExchangeInterface from '../Interfaces/ExchangeInterface';


export default class Bitsaa implements ExchangeInterface {
    privateApi: AxiosInstance
    publicApi: AxiosInstance
    baseUrl: string
    apiKey: string
    secretKey: string

    constructor(obj?: Object) {
        const objKeys = Object.keys(obj)
        for (const key of objKeys) {
            this[key] = obj[key]
        }
        this.baseUrl = 'https://bitssa.com/api/v2'
        this.privateApi = axios.create({
            baseURL: this.baseUrl
        })
        this.publicApi = axios.create({
            baseURL: this.baseUrl
        })

        this.privateApi.interceptors.request.use(
            config => this.axiosInterceptor(config),
            error => Promise.reject(error)
        );
    }

    static getExtraParams(url: string):object {
        const index  = url.indexOf('?')
        const result = { url }
        if (index !== -1) {
            const newUrl = url.substr(index + 1)
            result.url = result.url.substr(0, index)
            const params     = newUrl.split('&')
        }
        return result
    }

    axiosInterceptor(config: any) {
        const nounce = new Date().getTime()

        let params          = ''
        let queryParamsList = [`access_key=${this.apiKey}`, `tonce=${nounce}`]

        let { url } = config

        const index = url.indexOf('?')

        // Get query parameters from url and add it into array
        if (index !== -1) {
            params = url.substr(index + 1)
            url = url.substr(0, index)
            queryParamsList = queryParamsList.concat(params.split('&'))
        }
        // sorting all query params in alphabateical order
        // since bitsaa require params in alphabatical order
        queryParamsList.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
        const queryParams = queryParamsList.join('&')

        const text          = `${config.method.toUpperCase()}|/api/v2${url}|${queryParams}`
        const hash          = crypto.HmacSHA256(text, this.secretKey).toString()
        const newConfig     = config

        newConfig.url = `${url}?${queryParams}&signature=${hash}`
        // console.log(config);
        // if(nounce !== 2) throw new Error("")
        return newConfig
    }

    async getBalance(cryptocoin?:CryptoCoin): Promise<Account> {
        const url = '/members/me.json'
        const res = await this.privateApi.get(url)
        const account = new Account({
            exchangeName: this.getExchangeName()
        })
        for (const accObj of res.data.accounts) {
            account.setBalance(accObj.currency, Number(accObj.balance))
        }
        return account
    }

    async getMyOrders(cryptocoin?: CryptoCoin): Promise<any> {
        const url = '/orders.json?market=dkdbtc'
        const res = await this.privateApi.get(url)
        return res.data
    }

    async cancelMyAllOrders(cryptocoin?: CryptoCoin): Promise<any> {
        if (!cryptocoin) {
            const url = '/orders/clear.json'
            const res = await this.privateApi.post(url)
            return null;
        }

        const ordersList = await this.getMyOrders(cryptocoin)
        return Promise.all(ordersList.map(order => this.cancelMyOrder(order.id, cryptocoin)))
    }

    async cancelMyOrder(id: any, cryptocoin: CryptoCoin): Promise<any> {
        const url = `/order/delete.json?id=${id}`
        const res = await this.privateApi.post(url)
        return res.data
    }

    static getMarket(cryptocoin: CryptoCoin):string {
        switch (cryptocoin.priCoin) {
            case 'dkd':
                return 'dkdbtc'
            default:
        }
        throw new Error('invalid cryptocoin')
    }

    async putOrder(order: Order):Promise<Order> {
        let url  = '/orders.json?'
        url += `market=${Bitsaa.getMarket(order.cryptocoin)}`
        url += `&price=${order.price}`
        url += `&side=${Bitsaa.getOrderType(order.type)}`
        url += `&volume=${order.volume}`
        try {
            const res = await this.privateApi.post(url)
            if (res.data) {
                const newOrder = order
                newOrder.id = res.data.id
                return newOrder
            }
            throw new Error('unable to put order ')
        } catch (error) {
            throw new Error(error)
        }
    }

    static getOrderType(type: OrderTypeEnum):string {
        switch (type) {
            case OrderTypeEnum.BUY: return 'buy'
            case OrderTypeEnum.SELL: return 'sell'
            default:
        }
        throw new Error('Invalid Type')
    }

    async getBuyOrders(cryptocoin: CryptoCoin): Promise<Order[]> {
        const url = `order_book.json?market=${Bitsaa.getMarket(cryptocoin)}&asks_limit=1`
        const ordersList: Order[] = []
        const res = await this.publicApi.get(url)
        for (const orderObj of res.data.bids) {
            ordersList.push(new Order({
                type  : OrderTypeEnum.BUY,
                volume: orderObj.volume,
                price : orderObj.price,
                cryptocoin
            }))
        }
        return ordersList
    }
    async getSellOrders(cryptocoin: CryptoCoin): Promise<Order[]> {
        const url = `order_book.json?market=${Bitsaa.getMarket(cryptocoin)}&bids_limit=1`
        const ordersList: Order[] = []
        const res = await this.publicApi.get(url)
        for (const orderObj of res.data.asks) {
            ordersList.push(new Order({
                type  : OrderTypeEnum.SELL,
                volume: orderObj.volume,
                price : orderObj.price,
                cryptocoin
            }))
        }
        return ordersList
    }

    async getOrders(cryptocoin: CryptoCoin):
        Promise<{ buyOrderList: Order[], sellOrderList: Order[] }> {
        const url                    = `order_book.json?market=${Bitsaa.getMarket(cryptocoin)}`
        const res                    = await this.publicApi.get(url)
        const buyOrderList: Order[]  = []
        const sellOrderList: Order[] = []
        for (const orderObj of res.data.asks) {
            sellOrderList.push(new Order({
                type  : OrderTypeEnum.SELL,
                volume: Number(orderObj.volume),
                price : Number(orderObj.price),
                cryptocoin
            }))
        }
        // console.log(JSON.stringify(sellOrderList));
        for (const orderObj of res.data.bids) {
            buyOrderList.push(new Order({
                type  : OrderTypeEnum.BUY,
                volume: Number(orderObj.volume),
                price : Number(orderObj.price),
                cryptocoin
            }))
        }
        return { buyOrderList, sellOrderList }
    }

    toString() {
        return 'Exchange Name: Bitsaa'
    }

    getExchangeName(): string {
        return 'bitsaa'
    }
}
