import React from 'react';
import { createContext, useContext, useEffect, useReducer } from 'react'
import { cvReducer, initialState } from './cvReducer'

const STORAGE_KEY = 'opus-cv'

// « Rien n'est perdu » : le brouillon est conservé dans le navigateur
function loadState(init) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved ? { ...init, ...saved } : init
  } catch { return init }
}

const CVContext    = createContext(null)
const CVDispatch   = createContext(null)

export function CVProvider({ children }) {
  const [state, dispatch] = useReducer(cvReducer, initialState, loadState)
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* quota / navigation privée */ }
  }, [state])
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
