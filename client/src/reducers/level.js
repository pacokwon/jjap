const level = (state = 5, action) => {
  switch (action.type) {
    case 'SET_LEVEL':
      return action.level
    default:
      return 5
  }
}

export default level
