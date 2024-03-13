export interface Data {
  id: string;
  name: string;
  children: {[key:string]: Data} | {};
  level: number;
}

export type DataType = {[key:string]: Data}