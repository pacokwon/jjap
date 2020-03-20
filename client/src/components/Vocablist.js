import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
  thead: {
    textTransform: 'capitalize'
  }
})

const VocabList = ({ rows }) => {
  const classes = useStyles()
  const thead = rows[0] ? Object.keys(rows[0]).filter(col => !['id', 'part'].includes(col)) : []

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead className={classes.thead}>
          <TableRow>
            {thead.map(head => (
              <TableCell key={head}>{head}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.furigana}</TableCell>
              <TableCell>{row.kanji}</TableCell>
              <TableCell>{row.meaning}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default VocabList
