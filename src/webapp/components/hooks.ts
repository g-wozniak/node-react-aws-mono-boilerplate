import { useEffect, useRef } from 'react'

export const useMountEffect = (func: any) => useEffect(func, [])

export const usePrevious = (value: any) => {
  const ref = useRef()
  useEffect(() => { ref.current = value })
  return ref.current
}