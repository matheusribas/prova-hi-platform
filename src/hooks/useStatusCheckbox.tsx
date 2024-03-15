import { useContext } from "react";
import { StatusCheckboxContext } from "../context/StatusCheckbox";
import { StatusCheckboxContextType } from "../types/StatusCheckboxType";

export function useStatusCheckbox(): StatusCheckboxContextType {
  const context = useContext(StatusCheckboxContext);

  if (!context) {
    throw new Error('useStatusCheckbox deve ser usado dentro de um StatusCheckboxProvider');
  }
  
  return context;
}