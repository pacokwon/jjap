import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { wordParts } from '../actions'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  formControl: {
    margin: theme.spacing(3)
  }
}))


const VocablistLayout = () => {
  const classes = useStyles()
  const [ checkedState, setCheckedState ] = useState(
    wordParts.reduce((acc, cur) => ({ ...acc, [ cur ]: false }), {})
  )

  const toggleCheckedState = name => event => {
    setCheckedState({ ...checkedState, [ name ]: event.target.checked })
  }

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Select Part</FormLabel>
        <FormGroup>
          {
            wordParts.map(part => (
              <FormControlLabel
                key={part}
                control={<Checkbox checked={checkedState[ part ]} onChange={toggleCheckedState(part)} value={part} />}
              />
            ))
          }
        </FormGroup>
      </FormControl>
    </div>
  )
}

export default VocablistLayout
