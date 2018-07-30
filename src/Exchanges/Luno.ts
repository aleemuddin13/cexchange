import axios, { AxiosInstance } from 'axios'
import ExchangeInterface from '../interfaces/ExchangeInterface'
import CryptoCoin from '../util/CrytoCoin'
import Order from '../util/Order'
import Ticker from '../util/Ticker'
import Account from '../util/Account'
import { OrderTypeEnum } from '../enums/index'

const BASE_URL = 'https://api.mybitx.com/api/1/'

export default class Luno implements ExchangeInterface {
    privateApi: AxiosInstance
    publicApi: AxiosInstance
    baseUrl: string
    apiKey: string
    secretKey: string

    constructor(obj?: Object) {
        if (obj) {
            const objKeys = Object.keys(obj)
            for (const key of objKeys) {
                this[key] = obj[key]
            }
        }
        this.baseUrl = BASE_URL
        this.privateApi = axios.create({
            baseURL: this.baseUrl
        })
        this.publicApi = axios.create({
            baseURL: this.baseUrl
        })

        this.privateApi.interceptors.request.use(
            config => this.axiosInterceptor(config),
            error => Promise.reject(error)
        )
    }

    axiosInterceptor(config: any) {
        return config
    }

    getBalance(cryptocoin?: CryptoCoin): Promise<Account> {
        throw new Error('Method not implemented.')
    }
    getMyOrders(): Promise<any> {
        throw new Error('Method not implemented.')
    }
    cancelMyAllOrders(cryptocoin?: CryptoCoin): Promise<any> {
        throw new Error('Method not implemented.')
    }
    cancelMyOrder(id: any, cryptocoin?: CryptoCoin): Promise<any> {
        throw new Error('Method not implemented.')
    }
    putOrder(order: Order): Promise<Order> {
        throw new Error('Method not implemented.')
    }
    async getBuyOrders(cryptocoin: CryptoCoin): Promise<Order[]> {
        const response = await this.publicApi.get(`/orderbook_top?pair=${Luno.getMarket(cryptocoin)}`)
        const ordersList: Order[] = []
        for (const orderObj of response.data.bids) {
            ordersList.push(new Order({
                type  : OrderTypeEnum.BUY,
                volume: Number(orderObj.volume),
                price : Number(orderObj.price),
                cryptocoin
            }))
        }
        return ordersList
    }
    async getSellOrders(cryptocoin: CryptoCoin): Promise<Order[]> {
        const response = await this.publicApi.get(`/orderbook_top?pair=${Luno.getMarket(cryptocoin)}`)
        const ordersList: Order[] = []
        for (const orderObj of response.data.asks) {
            ordersList.push(new Order({
                type  : OrderTypeEnum.SELL,
                volume: Number(orderObj.volume),
                price : Number(orderObj.price),
                cryptocoin
            }))
        }
        return ordersList
    }
    // eslint-disable-next-line
    async getOrders(
        cryptocoin: CryptoCoin): Promise<{ buyOrderList: Order[]; sellOrderList: Order[] }> {
        const url = `/orderbook_top?pair=${Luno.getMarket(cryptocoin)}`
        const response = await this.publicApi.get(url)
        const sellOrderList: Order[] = []
        const buyOrderList: Order[] = []
        for (const orderObj of response.data.asks) {
            sellOrderList.push(new Order({
                type  : OrderTypeEnum.SELL,
                volume: Number(orderObj.volume),
                price : Number(orderObj.price),
                cryptocoin
            }))
        }

        for (const orderObj of response.data.bids) {
            buyOrderList.push(new Order({
                type  : OrderTypeEnum.BUY,
                volume: Number(orderObj.volume),
                price : Number(orderObj.price),
                cryptocoin
            }))
        }
        return { buyOrderList, sellOrderList }
    }
    getTicker(cryptocoin?: CryptoCoin, withVolume: boolean = false): Promise<Ticker> {
        if (!withVolume) {
            return this.publicApi
                .get(`/pubticker/${Luno.getMarket(cryptocoin)}`)
                .then((response) => {
                    const result = response.data
                    return new Ticker({
                        ask : Number(result.ask),
                        bid : Number(result.bid),
                        last: Number(result.last),
                        cryptocoin
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return new Ticker({})
                })
        }
        throw new Error('Method not implemented.')
    }
    toString(): string {
        throw new Error('Method not implemented.')
    }
    getExchangeName(): string {
        throw new Error('Method not implemented.')
    }

    static getMarket(cryptocoin: CryptoCoin): string {
        switch (cryptocoin.priCoin) {
            case 'btc':
                return 'XBTNGN'
            case 'ngn':
                return 'XBTNGN'
            default:
        }
        throw new Error('invalid cryptocoin')
    }
}
