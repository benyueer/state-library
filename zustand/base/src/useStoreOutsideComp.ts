/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface TFishStore {
  type: string
  name: string
  changeName: (name: string) => void
}

export const useFishStore = create<TFishStore, [["zustand/persist", never], ["zustand/subscribeWithSelector", never]]>(
  // *使用中间件保留数据
  persist(
    subscribeWithSelector(
      (set) => ({
        type: 'good',
        name: 'hello',
        changeName: (name: string) => set({ name })
      })
    ),
    {
      name: 'fish',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// *在组件外使用订阅
// *第一个参数表示要订阅的值，不传代表所有值，第二个参数代表回调，传入(new, old)
const unsubName = useFishStore.subscribe((state) => state.name, console.log)