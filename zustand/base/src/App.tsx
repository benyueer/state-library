/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react'
import { TStore, useStore } from './store'
import { shallow } from 'zustand/shallow'
import { useFishStore } from './useStoreOutsideComp'


function App() {
  const [count, setCount] = useState(0)

  // @ts-ignore
  const { bears, increasePopulation } = useStore()
  // const increasePopulation = useStore((state: TStore) => state.increasePopulation)

  return (
    <>
      <div>
        <span>count: {count}</span>
        <button onClick={() => setCount(count + 1)}>add count</button>
        <p>bears: {bears}</p>
        <button onClick={increasePopulation}>add bear</button>
        <Child />
        <TransientUpdate />
      </div>
    </>
  )
}

export default App

function Child() {
  // @ts-ignore
  // *为了更好的控制重渲染，可以在第二个参数传入相等比较函数
  // *可以给 useStore 传入 selector, equalityFn，表示使用 equalityFn 作为相等比较函数
  // *例如以下返回 true 的相等比较函数永远不会触发更新
  // const bears = useStore(
  //   (state) => state.bears,
  //   (oldBears, newBears) => true
  // )

  const addData = useStore((state) => state.addData)
  const [bears, data] = useStore(
    (state: TStore) => [state.bears, state.data],
    shallow
  )

  console.log('child render')

  const syncAddBear = useStore((state) => state.syncAddBear)

  const changeName = useFishStore((state) => state.changeName)
  const fishName = useFishStore((state) => state.name)

  return (
    <div>
      <p>child</p>
      <button onClick={() => addData(1)}>add data item</button>
      <button onClick={() => syncAddBear()}>sync add bear</button>
      <button onClick={() => changeName(Math.random() + '')}>change name</button>
      <p>bears: {bears}</p>
      <p>
        {
          data.map(item => <span>{item}</span>)
        }
      </p>
      <p>fishName: {fishName}</p>
    </div>
  )
}

function TransientUpdate() {
  console.log('TransientUpdate')
  const nameRef = useRef(useFishStore.getState().name)
  
  // *当不需要根据状态更新重渲染时可以用这种方式
  useEffect(
    () => useFishStore.subscribe(
      (state) => (nameRef.current = state.name)
    ),
    []
  )

  return (
    <div>
      null
    </div>
  )  
}