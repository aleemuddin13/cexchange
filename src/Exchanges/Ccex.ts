import axios, { AxiosInstance } from 'axios'
import ExchangeInterface from '../interfaces/ExchangeInterface';
import CryptoCoin from '../util/CrytoCoin';
import Order from '../util/Order';
import Ticker from '../util/Ticker';
import Account from '../util/Account';

const BASE_URL = 'https://c-cex.com/t'

export default class Ccex implements ExchangeInterface {
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
        );
    }

    axiosInterceptor(config: any) {
        return config
    }

    getBalance(cryptocoin?: CryptoCoin): Promise<Account> {
        throw new Error('Method not implemented.');
    }
    getMyOrders(): Promise<any> {
        throw new Error('Method not implemented.');
    }
    cancelMyAllOrders(cryptocoin?: CryptoCoin): Promise<any> {
        throw new Error('Method not implemented.');
    }
    cancelMyOrder(id: any, cryptocoin?: CryptoCoin): Promise<any> {
        throw new Error('Method not implemented.');
    }
    putOrder(order: Order): Promise<Order> {
        throw new Error('Method not implemented.');
    }
    getBuyOrders(cryptocoin: CryptoCoin): Promise<Order[]> {
        throw new Error('Method not implemented.');
    }
    getSellOrders(cryptocoin: CryptoCoin): Promise<Order[]> {
        throw new Error('Method not implemented.');
    }
    getOrders(cryptocoin: CryptoCoin): Promise<{ buyOrderList: Order[]; sellOrderList: Order[]; }> {
        throw new Error('Method not implemented.');
    }
    getTicker(cryptocoin?: CryptoCoin, withVolume: boolean = false): Promise<Ticker> {
        if (!withVolume) {
            return this.publicApi
                .get(`/${Ccex.getMarket(cryptocoin)}.json`)
                .then((response) => {
                    const result = response.data
                    console.log(result);
                    return new Ticker({})
                }).catch((err) => {
                    console.log(err);
                    return new Ticker({})
                })
        }
        throw new Error('Method not implemented.');
    }
    toString(): string {
        throw new Error('Method not implemented.');
    }
    getExchangeName(): string {
        throw new Error('Method not implemented.');
    }

    static getMarket(cryptocoin: CryptoCoin): string {
        switch (cryptocoin.priCoin) {
            case 'btc':
                return 'btc-usd'
            default:
        }
        throw new Error('invalid cryptocoin')
    }
}
