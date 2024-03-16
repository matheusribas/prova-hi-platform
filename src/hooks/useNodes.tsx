import { useContext } from "react";
import { DataContextType } from "../types/DataType";
import { NodeContext } from "../context/Nodes";

export function useNodes(): DataContextType {
  const context = useContext(NodeContext);

  if (!context) {
    throw new Error('useNodes deve ser usado dentro de um NodeProvider');
  }
  
  return context;
}