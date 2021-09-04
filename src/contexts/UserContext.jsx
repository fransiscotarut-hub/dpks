import React, { useReducer, createContext, useCallback } from 'react'
import UserContextReducer from './UserContextReducer';

const initialState = { login: false, user: null };

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserContextReducer, initialState);

  const setAuth = useCallback((auth) => {
    dispatch({
      type: "SET_AUTH",
      payload: { auth, login: false, user: null }
    });
  }, [])

  const setLogin = useCallback((user) => {
    dispatch({
      type: "LOGIN",
      payload: {auth: state.auth, login: true, user}
    });
  }, [state]);

  const setLogout = useCallback(() => {
    dispatch({
      type: "LOGOUT",
      payload: {auth: state.auth, login: false, user: null}
    });
  }, [state]);

  return (
    <UserContext.Provider value={{ ...state, setAuth, setLogin, setLogout }}>
      {children}
    </UserContext.Provider>
  )
}