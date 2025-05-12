import {TreeNode} from "@/types/treenote";
import invariant from "tiny-invariant";


/**
 * Tree based document 를 표현하는 클래스
 *
 * TreeNode 를 기반으로 하여 tree 구조를 표현
 *
 * TreeNode 는 leftChildren, rightChildren 로 나뉘어져 있음
 * - leftChildren: 왼쪽 자식 노드들
 * - rightChildren: 오른쪽 자식 노드들
 *
 * 현재는 node value 가 한 글자인 경우만 다룸에 주의. node value 가 여러 글자인 경우에는 다음의 메소드가 영향을 받을 것으로 보임
 *
 * - fromString(id: string, title: string, root: TreeNode)
 * - fromTree(id: string, title: string, root: TreeNode)
 * - getNodeByIndex(index: number)
 * - getSuccessor(node: TreeNode)
 */
export class TreeNote {
  id: string;
  title: string;
  content: string;
  indexToChild: Map<number, TreeNode>;
  root: TreeNode;

  constructor(id: string, title: string, content: string, root: TreeNode) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.indexToChild = new Map<number, TreeNode>();
    this.root = root;
  }

  /**
   * plain text 를 tree 로 변환하는 팩토리 메소드
   */
  static fromString(id: string, title: string, content: string) {
    const _id = id;
    const _title = title;
    const _content = content;
    const _indexToChild = new Map<number, TreeNode>();
    const _root: TreeNode = {
      id: "0",
      value: null,
      leftChildren: [],
      rightChildren: [],
      key: 0
    };
    let curr = _root;
    for (let i = 0; i < _content.length; i++) {
      const node: TreeNode = {
        id: String(i + 1),
        value: _content[i],
        leftChildren: [],
        rightChildren: [],
        key: i + 1
      };
      _indexToChild.set(i, node);
      curr.rightChildren.push(node);
      curr = node;
    }

    return new TreeNote(_id, _title, _content, _root);
  }

  /**
   * Tree based document 를 복사하여 TreeNote 객체를 생성하는 팩토리 메소드
   *
   * root 의 소유권은 이 객체가 가지게 되므로 `root` 를 넘겨준 후에는 객체 외부에서 수정되지 말아야 함
   *
   * @param id note id
   * @param title note title
   * @param root root node of tree based document
   */
  static fromTree(id: string, title: string, root: TreeNode) {
    const _id = id;
    const _title = title;
    const _indexToChild = new Map<number, TreeNode>();
    const _root = root;

    const contentBuffer: string[] = [];
    const stack: { node: TreeNode; state: "left" | "self" | "right"; index: number }[] = [];

    stack.push({ node: root, state: "left", index: 0 });

    while (stack.length > 0) {
      const top = stack[stack.length - 1];

      if (top.state === "left") {
        // Traverse leftChildren one by one
        if (top.index < top.node.leftChildren.length) {
          const child = top.node.leftChildren[top.index++];
          stack.push({ node: child, state: "left", index: 0 });
        } else {
          top.state = "self";
        }
      } else if (top.state === "self") {
        top.state = "right";
        top.index = 0;
        if (!top.node.value)
          continue;
        contentBuffer.push(top.node.value);
        _indexToChild.set(contentBuffer.length - 1, top.node);
      } else if (top.state === "right") {
        if (top.index < top.node.rightChildren.length) {
          const child = top.node.rightChildren[top.index++];
          stack.push({ node: child, state: "left", index: 0 });
        } else {
          stack.pop();
        }
      }
    }
    const _content = contentBuffer.join("");

    return new TreeNote(_id, _title, _content, _root);
  }

  /**
   * text index 로 tree node 를 찾는 메소드
   */
  getNodeByIndex(index: number): TreeNode | undefined {
    return this.indexToChild.get(index);
  }

  /**
   * successor node 를 찾는 메소드
   *
   * tombstone node 를 넘겨주면 안됨 (value 이 null 인 node)
   */
  getSuccessor(node: TreeNode): TreeNode | undefined {
    invariant(node.key !== undefined, "node.key is undefined");
    invariant(node.key !== null, "node.key is null");
    const index = node.key as number;
    if (index === undefined) {
      return undefined;
    }
    const nextIndex = 1 + index;
    return this.indexToChild.get(nextIndex);
  }
}