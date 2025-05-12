export interface TreeNode {
  id: string;
  value?: string | null;
  leftChildren: TreeNode[];
  rightChildren: TreeNode[];
  key?: number | null;
}