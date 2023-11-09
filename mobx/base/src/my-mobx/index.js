let curActive = null

const deps = new Map()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function observable(obj) {
  return new Proxy(obj, {
    get(target, key) {
      if (!!curActive) {
        if (!deps.has(target)) {
          deps.set(target, new Map())
        }

        const as = deps.get(target)

        if (!as.has(key)) {
          as.set(key, new Set())
        }

        const s = as.get(key)
        s.add(curActive)
      }
      return target[key]
    },
    set(target, key, value) {
      const as = deps.get(target) || new Map()
      const s = as.get(key) || []
      target[key] = value
      
      for (let i of s) {
        i()
      }
      return value
    }
  })
}

function autoRun(fn) {
  curActive = fn
  fn()
}

function observer(comp) {
  
}


const s = observable({
  count: 1,
  name: 'asd'
})

autoRun(() => {
  console.log(s.count)
})

s.count = 2

s.name = 'qwe'

s.count = 3
