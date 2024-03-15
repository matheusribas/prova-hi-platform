import { useEffect, useRef } from "react"
import { Data } from "../../types/DataType"
import { useStatusCheckbox } from "../../hooks/useStatusCheckbox"

interface InputProps {
  nodeCurrent: Data,
  handleChange: (nodeCurrent: Data) => void
}

export function Input({ nodeCurrent, handleChange }: InputProps) {

  const { statusCheckbox, setDefaultStatusCheckbox } = useStatusCheckbox()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!inputRef || !inputRef.current) return

    if (statusCheckbox[nodeCurrent.id]?.indeterminate) {
      inputRef.current.indeterminate = true
    } else {
      inputRef.current.indeterminate = false
    }
  }, [inputRef, nodeCurrent, statusCheckbox])

  useEffect(() => {
    setDefaultStatusCheckbox(nodeCurrent.id)
  }, [])

  return (
    <div className="flex gap-4 flex-1 items-center">
      <input 
        id={nodeCurrent.id} 
        type="checkbox" 
        ref={inputRef}
        className="accent-green-500 w-4 h-4 ml-4"
        checked={!!statusCheckbox[nodeCurrent.id]?.checked}
        onChange={_ => handleChange(nodeCurrent)}
      />
      <label htmlFor={nodeCurrent.id} className="font-semibold flex-1 py-4 cursor-pointer">{nodeCurrent.name}</label>
    </div>
  )
}