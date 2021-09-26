# cexchange
Implementation of private and public api's of crypto exchanges

# Video Demo
[![Crypto Exchange Demo - WyomingHackathon](https://img.youtube.com/vi/RT-2c8oqIrg/0.jpg)](https://www.youtube.com/watch?v=RT-2c8oqIrg "Crypto Exchange Demo - WyomingHackathon")]

[![Build Status](https://travis-ci.org/aleemuddin13/cexchange.svg?branch=master)](https://travis-ci.org/aleemuddin13/cexchange)
[![Coverage Status](https://coveralls.io/repos/github/aleemuddin13/cexchange/badge.svg?branch=master)](https://coveralls.io/github/aleemuddin13/cexchange?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/aleemuddin13/cexchange/badge.svg?targetFile=package.json)](https://snyk.io/test/github/aleemuddin13/cexchange?targetFile=package.json)
[![Dependencies](https://david-dm.org/aleemuddin13/cexchange.svg)](https://david-dm.org/aleemuddin13/cexchange.svg)
[![Exchanges](https://img.shields.io/badge/exchanges-2-blue.svg)](https://img.shields.io/badge/exchanges-2-blue.svg)

## Installation
```shell
npm i cexchange --save
```

## Usage
```shell
const cexchange = require('cexchange')

const bitsaa = new cexchange.Bitsaa({
  apiKey: 'YOUR_API_KEY',  //optional when using public methods.
  secretKey: 'YOUR_SECRET_KEY' //optional when using public methods.
})
bistaa.getBalance().then((data) => {
  console.log(data)
})
```

## Methods
**Public Methods** 

   Method name  |Params                         |Description                  
----------------|-------------------------------|-----------------------------
|getMarket|{}            | -           |
|getBuyOrders |{}            | -           |
|getSellOrders|{}            | -           |
|getOrders|{}            | -           |
|getExchangeName|{}            | -           |

**Private Methods**

   Method name  |Params                         |Description                  
----------------|-------------------------------|-----------------------------
|getBalance|{}            | -           |
|getMyOrders |{}            | -           |
|cancelMyAllOrders|{}            | -           |
|cancelMyOrder|{}            | -           |
|putOrder|{}            | -           |

## Supported Exchanges

  Exchange 
------------|
Bitsaa
Tradesatoshi
