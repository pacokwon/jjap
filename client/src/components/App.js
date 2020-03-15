import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Switch>
      <Route path='/' component={null} />
      <Route path='/vocab' component={null} />
    </Switch>
  </BrowserRouter>
)

export default App
