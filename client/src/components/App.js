import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'
import VocablistLayout from '../layouts/VocablistLayout'

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Switch>
      <Route path='/vocab' component={VocablistLayout} />
      <Route path='/' component={null} />
    </Switch>
  </BrowserRouter>
)

export default App
