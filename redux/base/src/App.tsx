// import { connect, useDispatch, useSelector } from "react-redux"
import { connect, useDispatch, useSelector } from "./my-redux"
import { counterInc, add, StoreType } from "./store"

function App() {

  return (
    <div>
      <p>App</p>
      <ChildOne />
      <ChildTwo />
      <ChildThree />
    </div>
  )
}

export default App


function ChildOne() {
  // *使用 react-redux 提供的 hook
  const store = useSelector((state: StoreType) => state.counter)
  const dispatch = useDispatch()
  return (
    <div>
      <p>child one</p>
      <p>{store}</p>
      <button onClick={() => dispatch(counterInc)}>inc</button>
    </div>
  )
}

interface ChildTwoProps {
  count: number
  add: (num: number) => void
}


function child2(props: ChildTwoProps) {
  return (
    <div>
      <p>child two</p>
      <p>{props.count}</p>
      <button onClick={() => props.add(3)}>add</button>
    </div>
  )
}

// * 使用 connect 函数包装高阶组件
const ChildTwo = connect(
  // * 接收两个参数，分别是 mapState  mapDispatch，将state和action作为被包装组件的 props
  ({counter}) => ({count: counter as number}),
  (dispatch) => ({
    add: (num: number) => dispatch(add(num))
  })
)(child2)


function ChildThree() {
  const dispatch = useDispatch()

  const syncAction = async () => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })

    dispatch(counterInc)
  }

  return (
    <div>
      <p>ChildThree</p>
      <button onClick={syncAction}>sync action</button>

    </div>
  )
}