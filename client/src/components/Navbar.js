import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CssBaseLine from '@material-ui/core/CssBaseLine'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
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
  }
}))

const Navbar = () => {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <CssBaseLine />
      <AppBar position='static'>
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
              <Typography
                variant='h5'
              >
                あ
              </Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              keepMounted
            >
              <MenuItem onClick={handleClose}>JLPT N1</MenuItem>
              <MenuItem onClick={handleClose}>JLPT N2</MenuItem>
              <MenuItem onClick={handleClose}>JLPT N3</MenuItem>
              <MenuItem onClick={handleClose}>JLPT N4</MenuItem>
              <MenuItem onClick={handleClose}>JLPT N5</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

export default Navbar
