export interface CRDTOperation {
  type: "INSERT" | "REMOVE",
  nodeId: string,
  value?: string,
  parentId?: string
}