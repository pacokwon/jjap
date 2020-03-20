import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { setLevel } from '../actions'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CssBaseLine from '@material-ui/core/CssBaseLine'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  list: {
    width: 250
  },
  title: {
    flexGrow: 1
  },
  vocabButton: {
    borderRadius: 20
  },
  appbar: {
    marginBottom: 30
  }
}))

const Navbar = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = level => () => {
    dispatch(setLevel(level))
    setAnchorEl(null)
    history.push('/vocab')
  }

  return (
    <React.Fragment>
      <CssBaseLine />
      <AppBar position='static' className={classes.appbar}>
        <Toolbar>
          <Typography
            variant='h6'
            className={classes.title}
          >
            JJAP
          </Typography>
          <div>
            <Button
              onClick={handleOpen}
              color='inherit'
              className={classes.vocabButton}
            >
              <Typography variant='h5'>あ</Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              keepMounted
            >
              {
                [ 1, 2, 3, 4, 5 ].map(level => (
                  <MenuItem key={level} onClick={handleClose(level)}>JLPT N{level}</MenuItem>
                ))
              }
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

export default Navbar
