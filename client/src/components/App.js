import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import Navbar from './Navbar'
import VocablistLayout from '../layouts/VocablistLayout'

const App = () => {
  const darkmode = useSelector(state => state.darkmode)

  const theme = createMuiTheme({
    palette: {
      type: darkmode ? 'dark' : 'light'
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path='/vocab' component={VocablistLayout} />
          <Route path='/' component={null} />
        </Switch>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
