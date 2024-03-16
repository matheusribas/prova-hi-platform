import { Node } from "../Node";
import { Error } from "../Error";
import { Loading } from "../Loading/index.tsx";
import { StatusCheckboxProvider } from "../../context/StatusCheckbox.tsx";
import { useNodes } from "../../hooks/useNodes.tsx";

export function Tree() {
  const { nodes, isLoading } = useNodes()

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
