export interface EditAction {
  type: "insert" | "delete",
  newNodeId?: string,
  newNodeValue?: string,
  newNodeSide?: "left" | "right",
  parentNodeId?: string,
  targetNodeId?: string
}