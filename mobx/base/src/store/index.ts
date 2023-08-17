import { makeObservable, observable, computed, action, flow } from "mobx"

export class Doubler {
    value: number

    constructor(value: number) {
        makeObservable(this, {
            value: observable,
            double: computed,
            increment: action,
            fetch: flow,
        })
        this.value = value
    }

    get double() {
        return this.value * 2
    }

    increment() {
        this.value++
    }

    *fetch(): Generator<Promise<number>> {
      const res = yield new Promise<number>((resolve) => {
        setTimeout(() => resolve(Math.random()), 2000)
      })

      this.value = res as number
    }
}

export const DoublerStore = new Doubler(1)
