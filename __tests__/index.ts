import { test, Greeting } from '../src/index';

describe('Basic test', () => {
    it("should return undefined", () => {
        test(new Greeting())
    })
})