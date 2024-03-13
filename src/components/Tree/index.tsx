import { DataType } from "../../types/DataType";
import { Node } from "../Node";

interface TreeProps {
  nodes: DataType
}

export function Tree({ nodes }: TreeProps) {

  return (
    <div className="overflow-y-auto pr-2">
      <Node node={nodes} />
    </div>
  )
}
