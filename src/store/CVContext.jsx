import React from 'react';
import { createContext, useContext, useReducer } from 'react'
import { cvReducer, initialState } from './cvReducer'

const CVContext    = createContext(null)
const CVDispatch   = createContext(null)

export function CVProvider({ children }) {
  const [state, dispatch] = useReducer(cvReducer, initialState)
  return (
    <CVContext.Provider value={state}>
      <CVDispatch.Provider value={dispatch}>
        {children}
      </CVDispatch.Provider>
    </CVContext.Provider>
  )
}

export function useCVState()    { return useContext(CVContext) }
export function useCVDispatch() { return useContext(CVDispatch) }

export function useCV() {
  return { state: useCVState(), dispatch: useCVDispatch() }
}
