import { useState, useEffect } from "react";

const getLocalValue = (key, initValue) => {
  //ssr
  if (typeof window === 'undefined') return initValue
  //normal get from localstorage
  const localValue = JSON.parse(localStorage.getItem(key))
  if (localValue) return localValue
  //fn
  if (initValue instanceof Function) return initValue()
  //default
  return initValue
}

const useLocalStorage = (key, initValue) => {
  const [value, setValue] = useState(() => { return getLocalValue(key, initValue) })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage