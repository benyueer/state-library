import React, { useCallback, useContext, useEffect, useLayoutEffect, useReducer, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/ban-types */

/* eslint-disable @typescript-eslint/no-unused-vars */
export function createStore(reducer: Function, enhancer?: Function) {

  if (enhancer) {
    return enhancer(createStore)(reducer)
  }

  let currentState
  let currentListeners = new Set()

  function getState() {
    return currentState
  }

  function dispatch(action) {
    currentState = reducer(currentState, action)
    currentListeners.forEach((listener) => listener())
  }

  function subscribe(listener) {
    currentListeners.add(listener)

    return () => {
      currentListeners.delete(listener)
    }
  }

  dispatch({ type: '', payload: null })

  return {
    getState,
    dispatch,
    subscribe
  }
}



export function applyMiddleware(...middlewares: any[]) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer)

    let dispatch = store.dispatch

    const midApi = {
      getState: store.getState,
      dispatch: (action: any, ...args: any[]) => dispatch(action, args)
    }

    const middlewareChina = middlewares.map((middleware) => middleware(midApi))

    dispatch = compose(...middlewareChina)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}

function compose(...funcs: any[]) {
  if (funcs.length === 0) {
    return (arg: any) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(((pre, cur) => (...args: any[]) => pre(cur(...args))))
}


export function combineReducers(reducers: Object) {
  let keys = Object.keys(reducers)

  let defaultState = {}

  // for (let i = 0; i < keys.length; i++) {
  //   defaultState[keys[i]] = null
  // }

  return function (state = defaultState, action) {
    let newState = {}
    for (let i = 0; i < keys.length; i++) {
      newState[keys[i]] = reducers[keys[i]](state[keys[i]], action)
    }

    return newState
  }
}



// 通过context传递数据
const Context = React.createContext({});

export function Provider({ store, children }: any) {
  return <Context.Provider value={store}>
    {children}
  </Context.Provider>
}

export const connect = (mapStateToProps: Function = (state: any) => state, mapDispatchToProps: Function | Object = (dispatch: Function) => dispatch) => (WarppedComponent: any) => (props: any) => {
  const store = React.useContext(Context);
  // @ts-ignore
  const { getState, dispatch, subscribe } = store;
  const stateProps = mapStateToProps(getState());
  let dispatchProps = { dispatch };
  if (typeof mapDispatchToProps === 'function') {
    dispatchProps = mapDispatchToProps(dispatch);
  } else if (typeof mapDispatchToProps === 'object') {
    dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
  }

  // 让函数组件强制更新
  // const [, forceUpdate] = useReducer((x: any) => x + 1, 0);
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    // @ts-ignore
    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });
    return () => {
      unsubscribe();
    }
  }, [forceUpdate, store])

  return <WarppedComponent {...props} {...stateProps} {...dispatchProps}></WarppedComponent>
}

// hook只能用在函数组件中，或自定义hook
function useForceUpdate() {
  const [state, setState] = useState(0)
  return useCallback(() => setState(prev => prev + 1), [])
}


function bindActionCreator(creator: Function, dispatch: Function) {
  return (...args: any) => dispatch(creator(...args))
}
export function bindActionCreators(creators: any, dispatch: Function) {
  let obj: any = {}
  for (let key in creators) {
    obj[key] = bindActionCreator(creators[key], dispatch)
  }
  return obj
}

export function useSelector(selector: Function) {

  const store = useStore()

  console.log(store)
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    // @ts-ignore
    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });
    return () => {
      unsubscribe();
    }
  }, [forceUpdate, store])

  // @ts-ignore
  const { getState } = store
  console.log(getState())
  const selectorState = selector(getState())

  return selectorState
}

export function useStore() {
  const store = useContext(Context)
  return store
}

export function useDispatch() {
  const store = useStore()

  // @ts-ignore
  return store.dispatch
}