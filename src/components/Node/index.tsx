import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Data, DataType } from "../../types/DataType"
import { Input } from "../Input"
import { useStatusCheckbox } from "../../hooks/useStatusCheckbox"

interface NodeProps {
  node: DataType
}

export function Node({ node }: NodeProps) {
  const [openAccordions, setOpenAccordions] = useState<{[id: string]: boolean}>({})
  const { onChangeStatusCheckbox } = useStatusCheckbox()

  function handleToggleAccordion(nodeId: string) {
    setOpenAccordions(prev => {
      const updatedOpenAccordions = { ...prev }
      updatedOpenAccordions[nodeId] = !updatedOpenAccordions[nodeId]
      
      return { ...updatedOpenAccordions }
    })
  }

  function handleChange(nodeCurrent: Data) {
    onChangeStatusCheckbox({ nodeCurrent, brothers: node })
  }

  return (
    Object.entries(node).map(([, nodeCurrent]) => {
      return (
        <ul key={nodeCurrent.id} className="w-full bg-slate-700 hover:bg-slate-700/70 first:rounded-t last:rounded-b overflow-hidden">
          <li className="flex justify-between items-center gap-4 border-b border-l border-slate-600">
            <Input
              nodeCurrent={nodeCurrent}
              handleChange={handleChange}
            />
            {(!!Object.keys(nodeCurrent.children).length) && (
              <button 
                className="pr-4 py-4 flex-1 flex justify-end"
                onClick={_ => handleToggleAccordion(nodeCurrent.id)}
              >
                <ChevronDown 
                  data-accordion={openAccordions[nodeCurrent.id] ? 'open' : 'closed'}
                  className="transition-transform data-[accordion='open']:rotate-180" 
                />
              </button>
            )}
          </li>
          {(Object.keys(nodeCurrent.children).length !== 0) && (
            <li
              className="pl-8 max-h-0 data-[accordion='open']:max-h-full"
              data-accordion={openAccordions[nodeCurrent.id] ? 'open' : 'closed'}
            >
              <Node node={nodeCurrent.children} />
            </li>
          )}
        </ul>
      )
    })
  )
}