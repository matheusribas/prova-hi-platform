import { ReactNode, createContext, useState } from "react";
import { StatusCheckboxContextType, StatusCheckboxType, TypeFunctionChangeCheckbox } from "../types/StatusCheckboxType";
import { DataType } from "../types/DataType";

interface StatusCheckboxProvider {
  children: ReactNode
}

export const StatusCheckboxContext = createContext<StatusCheckboxContextType | undefined>(undefined);

export function StatusCheckboxProvider({ children }: StatusCheckboxProvider) {
  const [statusCheckbox, setStatusCheckbox] = useState<StatusCheckboxType>({})

  function setDefaultStatusCheckbox(nodeId: string) {
    setStatusCheckbox(prev => ({ 
      ...prev, 
      [nodeId]: { 
        checked: false, 
        indeterminate: false 
      } 
    }))
  }

  function onChangeStatusCheckbox({nodeCurrent}: TypeFunctionChangeCheckbox) {
    const nodeId = nodeCurrent.id

    setStatusCheckbox(prev => {
      const updatedStatusCheckbox = { ...prev }
      const statusUpdated = {} as StatusCheckboxType

      function cascadeStatusOfChildren(node: DataType) {
        Object.entries(node).forEach(([, nodeCurrentForEach]) => {
          statusUpdated[nodeCurrentForEach.id] = { checked: !updatedStatusCheckbox[nodeId].checked,  indeterminate: false }
          
          if (!!nodeCurrentForEach?.children) {
            cascadeStatusOfChildren(nodeCurrentForEach?.children)
          }
        })
      }

      const haveChildren = !!nodeCurrent?.children
      if (haveChildren) cascadeStatusOfChildren(nodeCurrent?.children)
      
      return ({ 
        ...updatedStatusCheckbox, 
        ...statusUpdated,
        [nodeId]: { 
          checked: !updatedStatusCheckbox[nodeId].checked, 
          indeterminate: false
        }
      })
    })
  }

  return (
    <StatusCheckboxContext.Provider value={{statusCheckbox, setDefaultStatusCheckbox, onChangeStatusCheckbox}}>
      {children}
    </StatusCheckboxContext.Provider>
  )
}