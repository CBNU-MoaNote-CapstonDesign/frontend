export interface TreeNode {
  id: string;
  value?: string | null;
  parent?: TreeNode | null;
  successor?: TreeNode | null;
  leftChildren: TreeNode[];
  rightChildren: TreeNode[];
  key?: number | null;
}