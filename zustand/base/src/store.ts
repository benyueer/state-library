/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { create } from 'zustand'
import { create } from './my-zustand'

export interface TStore {
  bears: number
  data: number[]
  increasePopulation: () => void
  removeAllBears: () => void
  syncAddBear: () => void
  addData: (item: number) => void
}

export const useStore = create((set: any) => ({
  bears: 0,
  data: [],
  // *set 函数有第二个参数，true时表示覆盖state，false表示合并，默认false
  addData: (item: number) => set((state: TStore) => ({data: [...state.data, item]})),
  increasePopulation: () => set((state: { bears: number }) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  // *异步action
  syncAddBear: () => new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      set((state: TStore) => ({bears: state.bears + 1}))
      resolve()
    }, 1000)
  })
}))
