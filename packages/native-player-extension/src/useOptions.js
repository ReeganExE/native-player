import { useReducer, useCallback, useEffect } from 'react'
import { createAction, handleActions } from 'redux-actions'
import sendNative from './native'

const setPath = createAction('CHANGE_PATH')
const setConfig = createAction('SET_CONFIG')

const reducer = handleActions(
  {
    CHANGE_PATH: (s, a) => ({ ...s, programPath: a.payload }),
    SET_CONFIG: (s, a) => a.payload
  },
  {}
)

export default () => {
  const [state, dispatch] = useReducer(reducer, {})

  useEffect(async () => {
    const res = await sendNative({ type: 'GET_CONFIG' })
    dispatch(setConfig(res.payload))
  }, [window.location.search])

  return [
    state,
    {
      setPath: useCallback((value) => dispatch(setPath(value)), [])
    }
  ]
}
