const darkmode = (state = true, action) => {
  switch (action.type) {
    case 'TOGGLE_DARKMODE':
      return !state
    default:
      return state
  }
}

export default darkmode
