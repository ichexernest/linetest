import { useReducer, createContext, useContext } from 'react'

const ImgContext = createContext()

const initialState = {
  currentImg: {}
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'save_img':
      const img = action.payload
      console.log(action.payload)
      return {
        ...state,
        currentImg: img
      }
    default:
      return state
  }
}

export const ImgProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ImgContext.Provider value={{ Img: state, dispatch }}>{children}</ImgContext.Provider>
  )
}

export const useImg = () => {
  const context = useContext(ImgContext)
  if (context === undefined) {
    throw new Error('useImg must be used within a ImgProvider')
  }
  return context
}