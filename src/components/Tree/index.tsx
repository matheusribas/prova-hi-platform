import { useEffect, useState } from "react";

import { data } from '../../api/data.ts';
import { DataType } from "../../types/DataType";
import { StatusCheckboxType } from "../../types/StatusCheckboxType.ts";
import { getItemLocalStorage } from "../../utils/localStorege.ts";

import { Node } from "../Node";
import { Error } from "../Error";
import { Loading } from "../Loading/index.tsx";

export function Tree() {
  const [nodes, setNodes] = useState<DataType>({})
  const [isLoading, setIsLoading] = useState(true)
  const [statusCheckbox, setStatusCheckbox] = useState<StatusCheckboxType>({})

  function handleChangeCheckbox(nodeId: string) {
    setStatusCheckbox(prev => {
      const updatedStatusCheckbox = { ...prev }
      const findNode = Object.keys(updatedStatusCheckbox).find(id => id === nodeId)

      if (!findNode) {
        return ({ ...updatedStatusCheckbox, [nodeId]: { checked: true, indeterminate: false } })
      }
      
      return ({ ...updatedStatusCheckbox, [nodeId]: { checked: false, indeterminate: false } })
    })
  }

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const nodesLocalStorege = getItemLocalStorage<DataType>("@hi-platform:nodes", true)
      const currentData = nodesLocalStorege ?? data
  
      setNodes(currentData)
      setIsLoading(false)
    }, 500)
  }, [])

  const isEmpytNodes = !Object.values(nodes).length

  if (isLoading) {
    return <Loading />
  }

  if (isEmpytNodes) {
    return <Error />
  }
  
  return (
    <div className="overflow-y-auto pr-2">
      <Node 
        node={nodes}
        statusCheckbox={statusCheckbox}
        onChangeCheckbox={handleChangeCheckbox}
      />
    </div>
  )
}
