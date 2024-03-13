import { ChevronDown } from "lucide-react"
import { DataType } from "../../types/DataType"

interface NodeProps {
  node: DataType
}

export function Node({ node }: NodeProps) {
  return (
    Object.entries(node).map(([, nodeCurrent]) => {
      return (
        <ul key={nodeCurrent.id} className="w-full bg-slate-700 rounded overflow-hidden">
          <li className="flex justify-between items-center gap-4 border-b border-slate-600">
            <div className="flex gap-4 flex-1 items-center">
              <input id={nodeCurrent.id} type="checkbox" className="accent-green-500 w-4 h-4 ml-4" />
              <label htmlFor={nodeCurrent.id} className="font-semibold flex-1 py-4 cursor-pointer">{nodeCurrent.name}</label>
            </div>
            {(!!Object.keys(nodeCurrent.children).length) && (
              <button className="pr-4 flex-1 flex justify-end">
                <ChevronDown />
              </button>
            )}
          </li>
          {(Object.keys(nodeCurrent.children).length !== 0) && (
            <li className="pl-8">
              <Node node={nodeCurrent.children} />
            </li>
          )}
        </ul>
      )
    })
  )
}