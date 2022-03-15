export const CollapsedReducer = (prevState = {
  isCollapse: false
}, action) => {
  let { type } = action
  switch (type) {
    case "change_collapsed":
      let newState = { ...prevState }
      newState.isCollapse = !newState.isCollapse
      return newState
    default:
      return prevState
  }
}