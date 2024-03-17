import { ReactNode, createContext, useEffect, useState } from "react";
import { StatusCheckboxContextType, StatusCheckboxType, TypeFunctionChangeCheckbox } from "../types/StatusCheckboxType";
import { DataType } from "../types/DataType";
import { useNodes } from "../hooks/useNodes";
import { getItemLocalStorage, setItemLocalStorage } from "../utils/localStorege";

interface StatusCheckboxProvider {
  children: ReactNode
}
type ParentsIdsWithChildrenType = {
  [nodeParentId: string]: {
    childrensIds: string[],
    brothersIds: string[]
  }
}

interface FindParentNodeType {
  childNodeId: string, 
  parentsIds: ParentsIdsWithChildrenType, 
  brothersIds: string[]
}

export const StatusCheckboxContext = createContext<StatusCheckboxContextType | undefined>(undefined);

export function StatusCheckboxProvider({ children }: StatusCheckboxProvider) {
  const [statusCheckbox, setStatusCheckbox] = useState<StatusCheckboxType>({})
  const [parentsIdsWithChildren, setParentsIdsWithChildren] = useState<ParentsIdsWithChildrenType>({})
  const { nodes } = useNodes()

  function setDefaultStatusCheckbox(statusCheckboxes: StatusCheckboxType) {
    const checkboxesLocalStorege = getItemLocalStorage<StatusCheckboxType>({ item: "@hi-platform:checkboxes", isJSON: true })
    const currentCheckboxes = checkboxesLocalStorege ?? statusCheckboxes

    setStatusCheckbox(currentCheckboxes)
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

      function findParentNode({ childNodeId, parentsIds, brothersIds }: FindParentNodeType) {
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

      const updatedCheckboxes = { ...updatedStatusCheckbox, ...statusUpdated }
      
      setItemLocalStorage({
        item: "@hi-platform:checkboxes", 
        value: JSON.stringify(updatedCheckboxes)
      })

      return updatedCheckboxes
    })
  }

  useEffect(() => {
    const parents = {} as ParentsIdsWithChildrenType
    const defaultStatusOfCheckboxes = {} as StatusCheckboxType

    function setDefaultStatusAndParentNode(nodes: DataType) {
      const brothersNodesIds = Object.values(nodes).map(node => node.id)
      
      Object.entries(nodes).forEach(([, node]) => {
        defaultStatusOfCheckboxes[node.id] = { checked: false, indeterminate: false }

        if (!!Object.values(node?.children).length) {
          parents[node.id] = {
            childrensIds: Object.entries(node?.children).map(([, node]) => node.id),
            brothersIds: brothersNodesIds
          }
          setDefaultStatusAndParentNode(node?.children)
        }
      })
    }
    setDefaultStatusAndParentNode(nodes)

    setDefaultStatusCheckbox(defaultStatusOfCheckboxes)
    setParentsIdsWithChildren(parents)
  }, [nodes])

  return (
    <StatusCheckboxContext.Provider value={{statusCheckbox, onChangeStatusCheckbox}}>
      {children}
    </StatusCheckboxContext.Provider>
  )
}