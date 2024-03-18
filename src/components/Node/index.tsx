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
      const haveChildren = !!Object.keys(nodeCurrent.children).length

      return (haveChildren ? (
          <li
            key={nodeCurrent.id} 
            className="w-full bg-slate-700 hover:bg-slate-600/50 first:rounded-t last:rounded-b overflow-hidden data-[accordion='open']:bg-slate-600/50"
            data-accordion={openAccordions[nodeCurrent.id] ? 'open' : 'closed'}
          >
            <div className="flex justify-between items-center gap-4 border-b border-l border-slate-600">
              <Input
                nodeCurrent={nodeCurrent}
                handleChange={handleChange}
              />
              <button 
                className="pr-4 py-4 flex-1 flex justify-end"
                onClick={_ => handleToggleAccordion(nodeCurrent.id)}
                aria-label={`buttonOpenAccordion-${nodeCurrent.id}`}
              >
                <ChevronDown 
                  data-accordion={openAccordions[nodeCurrent.id] ? 'open' : 'closed'}
                  className="transition-transform data-[accordion='open']:rotate-180" 
                />
              </button>
            </div>
            <ul
              className="pl-8 hidden data-[accordion='open']:block"
              data-testid={`listCheckboxesChild-${nodeCurrent.id}`}
              data-accordion={openAccordions[nodeCurrent.id] ? 'open' : 'closed'}
            >
              <Node node={nodeCurrent.children} />
            </ul>
          </li>
        ) : (
          <li 
            key={nodeCurrent.id} 
            className="flex justify-between items-center gap-4 border-b border-l border-slate-600 bg-slate-700 hover:bg-slate-600/50 overflow-hidden"
          >
            <Input
              nodeCurrent={nodeCurrent}
              handleChange={handleChange}
            />
          </li>
        )
      )
    })
  )
}