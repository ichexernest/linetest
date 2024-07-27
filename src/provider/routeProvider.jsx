import { useReducer, createContext, useContext } from 'react'

const RouteContext = createContext()

const initialState = {
  routeNum: 1
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'go_routing':
      const routeNum = action.payload
      console.log(action.payload)
      return {
        ...state,
        routeNum: routeNum
      }
    default:
      return state
  }
}

export const RouteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <RouteContext.Provider value={{ Route: state, dispatch }}>{children}</RouteContext.Provider>
  )
}

export const useRoute = () => {
  const context = useContext(RouteContext)
  if (context === undefined) {
    throw new Error('useRoute must be used within a RouteProvider')
  }
  return context
}