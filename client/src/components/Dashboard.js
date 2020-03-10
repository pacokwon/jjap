import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CssBaseLine from '@material-ui/core/CssBaseLine'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'

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

export default () => {
    const classes = useStyles()

    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const toggleDrawer = state => () => {
        setDrawerOpen(state)
    }

    const handleOpen = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <React.Fragment className={classes.root}>
            <CssBaseLine />
            <AppBar position='static'>
                <Toolbar>
                    <IconButton className={classes.menuButton} color='inherit' onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
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
            <Drawer
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <div className={classes.list}>
                    <List>
                        {
                            [ 'foo', 'bar', 'baz' ].map(e => (
                                <ListItem key={e}>
                                    <ListItemText primary={e} />
                                </ListItem>
                            ))
                        }
                    </List>
                </div>
            </Drawer>
        </React.Fragment>
    )
}
