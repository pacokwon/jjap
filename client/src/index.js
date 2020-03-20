import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import App from './components/App.js'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'

axios.defaults.baseURL = 'http://localhost:8000'

const store = createStore(rootReducer)
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('App')
)
