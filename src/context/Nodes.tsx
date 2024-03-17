import { ReactNode, createContext, useEffect, useState } from "react";
import { DataContextType, DataType } from "../types/DataType";
import { getItemLocalStorage } from "../utils/localStorege";
import { data } from "../api/data";

interface NodeProvider {
  children: ReactNode
}

export const NodeContext = createContext<DataContextType | undefined>(undefined);

export function NodeProvider({ children }: NodeProvider) {
  const [nodes, setNodes] = useState<DataType>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const nodesLocalStorege = getItemLocalStorage<DataType>({ item: "@hi-platform:nodes", isJSON: true })
      const currentData = nodesLocalStorege ?? data
  
      setNodes(currentData)
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <NodeContext.Provider value={{nodes, isLoading}}>
      {children}
    </NodeContext.Provider>
  )
}