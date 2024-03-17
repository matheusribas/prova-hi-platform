import { Data, DataType } from "./DataType"

export type StatusCheckboxType = {
  [id: string]: {
    checked: boolean, 
    indeterminate: boolean 
  }
}
export type TypeFunctionChangeCheckbox = { nodeCurrent: Data, brothers: DataType }

export interface StatusCheckboxContextType {
  statusCheckbox: StatusCheckboxType,
  onChangeStatusCheckbox: ({ nodeCurrent, brothers }: TypeFunctionChangeCheckbox) => void
}