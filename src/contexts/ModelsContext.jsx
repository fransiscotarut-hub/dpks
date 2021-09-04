import React, { useReducer, createContext, useCallback } from 'react'
import ModelsContextReducer from './ModelsContextReducer';

const initialState = {
  models: {},
};

export const ModelsContext = createContext(initialState);

export const GlobalModelsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ModelsContextReducer, initialState);

  const setModels = useCallback((models) => {
    dispatch({
      type: 'SET_MODELS',
      payload: { models },
    })
  }, []);

  return (
    <ModelsContext.Provider value={{ ...state, setModels }}>
      {children}
    </ModelsContext.Provider>
  )
}