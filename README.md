# cexchnage
Implementation of private and public api's of crypto exchanges

[![Build Status](https://travis-ci.org/aleemuddin13/cexchnage.svg?branch=master)](https://travis-ci.org/aleemuddin13/cexchnage)
[![Coverage Status](https://coveralls.io/repos/github/aleemuddin13/cexchnage/badge.svg?branch=master)](https://coveralls.io/github/aleemuddin13/cexchnage?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/aleemuddin13/cexchnage/badge.svg?targetFile=package.json)](https://snyk.io/test/github/aleemuddin13/cexchnage?targetFile=package.json)
[![Dependencies](https://david-dm.org/aleemuddin13/cexchnage.svg)](https://david-dm.org/aleemuddin13/cexchnage.svg)
[![Exchnages](https://img.shields.io/badge/exchanges-2-blue.svg)](https://img.shields.io/badge/exchanges-2-blue.svg)

## Installation
```shell
npm i cexchnage --save
```

## Usage
```shell
const cexchnage = require('cexchnage')

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

## Supported Exchnages

  Exchnage 
------------|
Bitsaa
Tradesatoshi