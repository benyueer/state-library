import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import { Provider } from 'react-redux'
import { Provider } from './my-redux'
import { store } from './store/index.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
