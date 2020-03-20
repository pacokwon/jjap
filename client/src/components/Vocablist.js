import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
  thead: {
    textTransform: 'capitalize'
  },
  container: {
    maxHeight: 600
  }
})

const VocabList = ({ rows }) => {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const thead = rows[0] ? Object.keys(rows[0]).filter(col => !['id', 'part'].includes(col)) : []

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    setPage(0)
  }

  React.useEffect(() => {
    setPage(0)
  }, [rows])

  return (
    <Paper>
      <TableContainer className={classes.container}>
        <Table stickyHeader>
          <TableHead className={classes.thead}>
            <TableRow>
              {thead.map(head => (
                <TableCell
                  key={head}
                  component='th'
                  align='center'
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(row => (
              <TableRow key={row.id}>
                <TableCell align='center'>{row.furigana}</TableCell>
                <TableCell align='center'>{row.kanji}</TableCell>
                <TableCell align='center'>{row.meaning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[10, 20, 50]}
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default VocabList
