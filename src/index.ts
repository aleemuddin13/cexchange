export class Greeting {
    greet: string
    constructor() {
        this.greet = null
    }
}
export function test(greeting: Greeting) {
    console.log(greeting.greet)
}
// const a = 'a'
