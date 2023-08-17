import { createContext } from "react"
// import { applyMiddleware, combineReducers, createStore } from "redux"
import { applyMiddleware, combineReducers, createStore } from "../my-redux"
import { createLogger } from "redux-logger"
import thunk from "redux-thunk"

export enum CounterActionType {
  INC,
  DEC,
  ADD
}

export interface IAction<Y, T> {
  type: Y
  payload: T
}

// reducer
function counterReducer(state = 1, action: IAction<CounterActionType, number>) {
  const { type, payload } = action

  switch (type) {
    case CounterActionType.DEC:
      return state - 1
    case CounterActionType.INC:
      return state + 1
    case CounterActionType.ADD:
      return state + payload
    default:
      return state
  }
}

export const counterInc = {
  type: CounterActionType.INC,
  payload: 0
}

export const add = (num: number) => ({
  type: CounterActionType.ADD,
  payload: num
})

enum DataActionType {
  ADD
}

function dataReducer(state = [] as string[], action: IAction<DataActionType, string>) {
  const {type, payload} = action

  switch(type) {
    case DataActionType.ADD:
      return [...state, payload]
    default:
      return state
  }
}

export const addData = (data: string) => ({
  type: DataActionType.ADD,
  payload: data
})


// * 最基本的用法，只有一个 reducer 即一个state，且没有中间件
// export const store = createStore(counterReducer)

// *多个 reducer
const reducer = combineReducers({
  counter: counterReducer,
  data: dataReducer
})

export type StoreType = ReturnType<typeof reducer>


// *使用中间件
const logger = createLogger()
export const store = createStore(
  reducer,
  applyMiddleware(logger, thunk)
)


export const contextStroe = createContext(store)

