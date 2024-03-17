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
    <ul className="overflow-y-auto shadow scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-700">
      <StatusCheckboxProvider>
        <Node node={nodes} />
      </StatusCheckboxProvider>
    </ul>
  )
}
