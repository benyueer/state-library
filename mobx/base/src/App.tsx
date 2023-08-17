import { observer } from "mobx-react-lite"
import { Doubler, DoublerStore } from "./store"


function App() {

  return (
    <div>
      <p>app</p>

      <ChildOne doubler={DoublerStore}/>
    </div>
  )
}


interface ChildOneProps {
  doubler: Doubler
}

const ChildOne = observer((props: ChildOneProps) => {
  return (
    <div>
      <p>child one</p>
      <p>value: {props.doubler.value}</p>
      <p>doubler: {props.doubler.double}</p>
      <button onClick={() => props.doubler.increment()}>inc</button>
      <button onClick={() => props.doubler.fetch()}>fetch</button>
    </div>
  )
})


export default App
