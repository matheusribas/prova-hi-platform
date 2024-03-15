import { useEffect, useState } from "react";

import { data } from '../../api/data.ts';
import { DataType } from "../../types/DataType";
import { getItemLocalStorage } from "../../utils/localStorege.ts";

import { Node } from "../Node";
import { Error } from "../Error";
import { Loading } from "../Loading/index.tsx";
import { StatusCheckboxProvider } from "../../context/StatusCheckbox.tsx";

export function Tree() {
  const [nodes, setNodes] = useState<DataType>({})
  const [isLoading, setIsLoading] = useState(true)

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
      <StatusCheckboxProvider>
        <Node node={nodes} />
      </StatusCheckboxProvider>
    </div>
  )
}
