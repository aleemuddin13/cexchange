import * as fs from 'fs';
import * as path from 'path';
import Exchange from '../../../src/Exchanges/index';

describe('Check Exchange Files', () => {
    it('Should check for Exchnage Object and files', () => {
        const exchangeList = Object.keys(Exchange)
        return new Promise((resolve) => {
            fs.readdir(path.join(__dirname, '/../../../src/Exchanges'), (err, fileList) => {
                fileList.forEach((fileName) => {
                    if (fileName === 'index.ts') {
                        return
                    }
                    expect(fileName[0]).toBe(fileName[0].toUpperCase())
                    const fileNameWithoutExt = fileName.substr(0, fileName.indexOf('.'))
                    expect(exchangeList.indexOf(fileNameWithoutExt)).not.toBe(-1)
                })
                expect(fileList.length - 1).toBe(exchangeList.length)
                resolve()
            })
        })
    })
})

describe('Check Exchange Test Files', () => {
    it('Should check for Exchnage Object and files', () => {
        const exchangeList = Object.keys(Exchange)
        return new Promise((resolve) => {
            fs.readdir(__dirname, (err, fileList) => {
                fileList.forEach((fileName) => {
                    if (fileName === 'index.test.ts') {
                        return
                    }
                    expect(fileName[0]).toBe(fileName[0].toUpperCase())
                    const fileNameWithoutExt = fileName.substr(0, fileName.indexOf('.'))
                    expect(exchangeList.indexOf(fileNameWithoutExt)).not.toBe(-1)
                })
                expect(fileList.length - 1).toBe(exchangeList.length)
                resolve()
            })
        })
    })
})
