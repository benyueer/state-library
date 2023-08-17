import { useSyncExternalStore } from "react"
import { createStore } from "./vanilla"

/* eslint-disable @typescript-eslint/no-explicit-any */
export function create(createState: any) {
  return createStateImpl(createState)
}

const createStateImpl = (createState: any) => {
  const api = createStore(createState)

  const useBoundStore = () => useStore(api)

  Object.assign(useBoundStore, api)

  return useBoundStore
}

export function useStore(api: any) {
  const slice = useSyncExternalStore(
    api.subscribe,
    api.getState,
    api.getState
  )

  return slice
}