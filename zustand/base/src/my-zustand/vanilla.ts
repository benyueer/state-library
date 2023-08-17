/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const createStore = (createState: any) => {
  let state: any

  // eslint-disable-next-line @typescript-eslint/ban-types
  const listeners = new Set<(n: any, p: any) => void>()

  const setState = (partial: any, replace: any) => {
    const nextState = 
      typeof partial === 'function'
        ? partial(state)
        : partial

    if (!Object.is(nextState, state)) {
      const previousState = state
      state = 
        replace ?? typeof nextState !='object'
          ? nextState
          : Object.assign({}, state, nextState)

      listeners.forEach((listener) => listener(state, previousState))
    }
  }

  const getState = () => state

  const subscribe = (listener: () => void) => {
    listeners.add(listener)

    return () => listeners.delete(listener)
  }

  const destory = () => {
    listeners.clear()
  }

  const api = {getState, setState, subscribe, destory}

  state = createState(setState, getState, api)

  return api

}