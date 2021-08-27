import React, { useReducer, createContext } from 'react'
import ModelsContextReducer from './ModelsContextReducer';

const initialState = {
  models: {},
};

export const ModelsContext = createContext(initialState);

export const GlobalModelsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ModelsContextReducer, initialState);

  const setModels = (models) => {
    dispatch({
      type: 'SET_MODELS',
      payload: { models },
    })
  }

  return (
    <ModelsContext.Provider value={{ ...state, setModels }}>
      {children}
    </ModelsContext.Provider>
  )
}