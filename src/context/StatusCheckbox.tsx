import { ReactNode, createContext, useEffect, useState } from "react";
import { StatusCheckboxContextType, StatusCheckboxType, TypeFunctionChangeCheckbox } from "../types/StatusCheckboxType";
import { DataType } from "../types/DataType";
import { useNodes } from "../hooks/useNodes";

interface StatusCheckboxProvider {
  children: ReactNode
}
type parentsIdsWithChildrenType = {
  [nodeParentId: string]: {
    childrensIds: string[],
    brothersIds: string[]
  }
}

interface findParentNodeType {
  childNodeId: string, 
  parentsIds: parentsIdsWithChildrenType, 
  brothersIds: string[]
}

export const StatusCheckboxContext = createContext<StatusCheckboxContextType | undefined>(undefined);

export function StatusCheckboxProvider({ children }: StatusCheckboxProvider) {
  const [statusCheckbox, setStatusCheckbox] = useState<StatusCheckboxType>({})
  const [parentsIdsWithChildren, setParentsIdsWithChildren] = useState<parentsIdsWithChildrenType>({})
  const { nodes } = useNodes()

  function setDefaultStatusCheckbox(nodeId: string) {
    setStatusCheckbox(prev => ({ 
      ...prev, 
      [nodeId]: { 
        checked: false, 
        indeterminate: false 
      } 
    }))
  }

  function onChangeStatusCheckbox({ nodeCurrent, brothers }: TypeFunctionChangeCheckbox) {
    const nodeId = nodeCurrent.id

    setStatusCheckbox(prev => {
      const updatedStatusCheckbox = { 
        ...prev,
        [nodeId]: { 
          checked: !prev[nodeId].checked, 
          indeterminate: false
        } 
      }
      const statusUpdated = {} as StatusCheckboxType

      function cascadeStatusOfChildren(node: DataType) {
        Object.entries(node).forEach(([, nodeCurrentForEach]) => {
          statusUpdated[nodeCurrentForEach.id] = { checked: updatedStatusCheckbox[nodeId].checked,  indeterminate: false }
          
          if (!!Object.values(nodeCurrent?.children).length) {
            cascadeStatusOfChildren(nodeCurrentForEach?.children)
          }
        })
      }

      const haveChildren = !!Object.values(nodeCurrent?.children).length
      if (haveChildren) cascadeStatusOfChildren(nodeCurrent?.children)

      function setStatusOfParent(parentNodeId: string, brothersIds: string[]) {
        const allStatusUpdated = { ...updatedStatusCheckbox, ...statusUpdated }
        let countTtlBrothersCheckedFind = 0
        let countTtlBrothersIndeterminateFind = 0

        Object.entries(allStatusUpdated).forEach(([nodeId, status]) => {
          if (status.checked && !status.indeterminate) { 
            if (brothersIds.indexOf(nodeId) !== -1) {
              countTtlBrothersCheckedFind++
            }
          } else if (status.indeterminate) {
            if (brothersIds.indexOf(nodeId) !== -1) {
              countTtlBrothersIndeterminateFind++
            }
          }
        })

        const allBrotherAreChecked = countTtlBrothersCheckedFind === brothersIds.length
        const someBrotherAreChecked = countTtlBrothersCheckedFind !== 0 && countTtlBrothersCheckedFind < brothersIds.length
        const noneBrotherAreChecked = countTtlBrothersCheckedFind === 0

        if (allBrotherAreChecked) {
          statusUpdated[parentNodeId] = { checked: true, indeterminate: false }
        } else if (someBrotherAreChecked || countTtlBrothersIndeterminateFind !== 0) {
          statusUpdated[parentNodeId] = { checked: false, indeterminate: true }
        } else if (noneBrotherAreChecked) {
          statusUpdated[parentNodeId] = { checked: false, indeterminate: false }
        }
      }

      function findParentNode({ childNodeId, parentsIds, brothersIds }: findParentNodeType) {
        if (!!Object.values(parentsIds).length) {
          Object.entries(parentsIds).find(([parentNodeId, childNodesIds]) => {
            const isParentOfChild = childNodesIds?.childrensIds.length && childNodesIds?.childrensIds.indexOf(childNodeId) !== -1

            if (isParentOfChild) {
              setStatusOfParent(parentNodeId, brothersIds)
              findParentNode({ 
                childNodeId: parentNodeId, 
                parentsIds: parentsIdsWithChildren, 
                brothersIds: childNodesIds.brothersIds
              })
              return true
            }
          })
        }
      }

      findParentNode({ 
        childNodeId: nodeId, 
        parentsIds: parentsIdsWithChildren, 
        brothersIds: Object.values(brothers).map(node => node.id)
      })

      return ({ 
        ...updatedStatusCheckbox, 
        ...statusUpdated
      })
    })
  }

  useEffect(() => {
    const parents = {} as parentsIdsWithChildrenType

    function setParentNode(nodes: DataType) {
      const brothersNodesIds = Object.values(nodes).map(node => node.id)
      
      Object.entries(nodes).forEach(([, node]) => {
        if (!!Object.values(node?.children).length) {
          parents[node.id] = {
            childrensIds: Object.entries(node?.children).map(([, node]) => node.id),
            brothersIds: brothersNodesIds
          }
          setParentNode(node?.children)
        }
      })
    }
    setParentNode(nodes)
    
    setParentsIdsWithChildren(parents)
  }, [nodes])

  return (
    <StatusCheckboxContext.Provider value={{statusCheckbox, setDefaultStatusCheckbox, onChangeStatusCheckbox}}>
      {children}
    </StatusCheckboxContext.Provider>
  )
}