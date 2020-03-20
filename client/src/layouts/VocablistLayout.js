import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import Checkbox from '@material-ui/core/Checkbox'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Typography from '@material-ui/core/Typography'
import { wordParts } from '../actions'
import VocabList from '../components/Vocablist'


const useStyles = makeStyles(theme => ({
  formgroup: {
    marginBottom: 30
  }
}))

let allVocab = []

const VocablistLayout = () => {
  const classes = useStyles()

  const [checkedState, setCheckedState] = useState(wordParts.reduce((acc, cur) => ({ ...acc, [ cur ]: true }), {}))
  const [vocabList, setVocabList] = useState([])
  const [loading, setLoading] = useState(false)
  const level = useSelector(state => state.level)

  const toggleCheckedState = name => event => {
    if (checkedState[name]) // turn name off
      setVocabList(prevState => prevState.filter(vocab => vocab.part !== name))
    else                    // turn name on
      setVocabList(prevState => [...prevState, ...allVocab.filter(vocab => vocab.part === name)])

    setCheckedState({ ...checkedState, [name]: event.target.checked })
  }

  useEffect(() => {
    setLoading(true)
    axios({
      method: 'GET',
      url: '/api/vocablist',
      params: { level }
    })
      .then(res => {
        allVocab = res.data
        setVocabList(res.data)
        setLoading(false)
      })
  }, [level])

  useEffect(() => {
    const checked = Object.keys(checkedState).filter(part => checkedState[part])
    setVocabList(allVocab.filter(vocab => checked.includes(vocab.part)))
  }, [checkedState])

  return (
    <Container fixed>
      <Typography
        variant='h4'
        gutterBottom
      >
        VocabList
      </Typography>
      <FormGroup row className={classes.formgroup}>
        {wordParts.map(part => (
          <FormControlLabel
            key={part}
            control={<Checkbox checked={checkedState[part]} onChange={toggleCheckedState(part)} value={part} />}
            label={part}
          />
        ))}
      </FormGroup>
      {loading ?
        <div>Loading..</div> :
        <VocabList rows={vocabList}/>
      }
    </Container>
  )
}

export default VocablistLayout
