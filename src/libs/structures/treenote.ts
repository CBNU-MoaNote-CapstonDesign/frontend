import {TreeNode} from "@/types/treenode";
import {EditAction} from "@/types/action";
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
  /**
   * User 의 UUID node 생성 시 node 의 id 에 사용
   */
  uuid: string
  id: string;
  title: string;
  content: string;
  indexToChild: Map<number, TreeNode>;
  idToNode: Map<string, TreeNode>;
  root: TreeNode;
  size: number;

  constructor(uuid: string, id: string, title: string, content: string, root: TreeNode, size: number = 1,
              indexToChild: Map<number, TreeNode>, idToNode: Map<string, TreeNode>) {
    this.uuid = uuid;
    this.id = id;
    this.title = title;
    this.content = content;
    this.indexToChild = indexToChild;
    this.idToNode = idToNode;
    this.root = root;
    this.size = size;
  }

  /**
   * plain text 를 tree 로 변환하는 팩토리 메소드
   */
  static fromString(uuid: string, id: string, title: string, content: string) {
    const _id = id;
    const _title = title;
    const _content = content;
    const _indexToChild = new Map<number, TreeNode>();
    const _idToNode = new Map<string, TreeNode>();
    const _root: TreeNode = {
      id: "0",
      value: null,
      parent: null,
      leftChildren: [],
      rightChildren: [],
      key: 0
    };
    let curr = _root;
    _indexToChild.set(0, _root);
    _idToNode.set(_root.id, _root);
    for (let i = 0; i < _content.length; i++) {
      const node: TreeNode = {
        id: String(i + 1),
        value: _content[i],
        parent: curr,
        leftChildren: [],
        rightChildren: [],
        key: i + 1
      };
      _indexToChild.set(i, node);
      _idToNode.set(node.id, node);
      curr.rightChildren.push(node);
      curr = node;
    }

    return new TreeNote(uuid, _id, _title, _content, _root, _content.length + 1, _indexToChild, _idToNode);
  }

  /**
   * Tree based document 를 복사하여 TreeNote 객체를 생성하는 팩토리 메소드
   *
   * root 의 소유권은 이 객체가 가지게 되므로 `root` 를 넘겨준 후에는 객체 외부에서 수정되지 말아야 함
   *
   * @param uuid node id prefix
   * @param id note id
   * @param title note title
   * @param root root node of tree based document
   */
  static fromTree(uuid: string, id: string, title: string, root: TreeNode) {
    const _id = id;
    const _title = title;
    const _indexToChild = new Map<number, TreeNode>();
    const _idToNode = new Map<string, TreeNode>();
    const _root = root;

    let size = 0;
    const contentBuffer: string[] = [];
    const stack: { node: TreeNode; state: "left" | "self" | "right"; index: number }[] = [];

    stack.push({ node: root, state: "left", index: 0 });
    _indexToChild.set(0, root);

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
        size++;
        top.state = "right";
        top.index = 0;
        _idToNode.set(top.node.id, top.node);
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

    return new TreeNote(uuid, _id, _title, _content, _root, size, _indexToChild, _idToNode);
  }

  /**
   * text index 로 tree node 를 찾는 메소드
   */
  getNodeByIndex(index: number): TreeNode | undefined {
    return this.indexToChild.get(index);
  }

  /**
   * successor node 를 찾는 메소드
   */
  getSuccessor(node: TreeNode): TreeNode | undefined {
    invariant(node.key !== undefined, "node.key is undefined");
    invariant(node.key !== null, "node.key is null");
    const index = node.key as number;
    if (index === undefined) {
      return undefined;
    }
    if (node.rightChildren.length > 0) {
      let successor = node.rightChildren[0];
      while (successor.leftChildren.length > 0) {
          successor = successor.leftChildren[0];
      }
      return successor;
    } else {
      let successor = node.parent;
      // node in successor.rightChildren
      while (successor && successor.rightChildren.filter(child => child.id === node.id).length === 0) {
        node = successor;
        successor = successor.parent;
      }
      let i = 0;
      while (successor && successor.leftChildren[i] !== node) {
        i++;
      }
      if (successor && i < successor.leftChildren.length) {
        return successor.leftChildren[i];
      } else {
        return undefined;
      }
    }
  }

  insert(insertAt: number, value: string) {
    const previousNode = this.getNodeByIndex(insertAt);
    invariant(previousNode, "previousNode is undefined");
    const successor = this.getSuccessor(previousNode);

    const newNode: TreeNode = {
      id: this.uuid + this.size.toString(),
      value: value,
      parent: null,
      leftChildren: [],
      rightChildren: [],
      key: this.indexToChild.size + 1
    };

    if (previousNode.rightChildren.length == 0) {
      newNode.parent = previousNode;
      this.onInsertAction(newNode, previousNode, "right");
    } else {
      invariant(successor, "successor is undefined");
      newNode.parent = successor;
      this.onInsertAction(newNode, successor, "left");
    }
  }

  onInsertAction(newNode: TreeNode, parent: TreeNode, side: "left" | "right") {
    this.size++;

    const sideArray = side === "left" ? parent.leftChildren : parent.rightChildren;

    let i = 0;
    for (; i < sideArray.length; i++) {
      if (sideArray[i].id < newNode.id) {
        sideArray.splice(i, 0, newNode);
        break;
      }
    }
    if (i === sideArray.length) {
      sideArray.push(newNode);
    }
    this.traversal();
  }

  remove(removeAt: number) {
    const nodeToRemove = this.getNodeByIndex(removeAt);
    invariant(nodeToRemove, "previousNode is undefined");
    this.onRemoveAction(nodeToRemove);
  }

  onRemoveAction(node: TreeNode) {
    invariant(node.key !== undefined, "node.key is undefined");
    invariant(node.key !== null, "node.key is null");
    if (node.value === null || node.value === undefined) {
      return;
    }
    node.value = null;
    this.traversal();
  }

  traversal() {
    const contentBuffer: string[] = [];
    this.indexToChild = new Map<number, TreeNode>();
    this.indexToChild.set(0, this.root);

    const stack: { node: TreeNode; state: "left" | "self" | "right"; index: number }[] = [];
    stack.push({ node: this.root, state: "left", index: 0 });

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
        if (top.node.value !== null && top.node.value !== undefined) {
          contentBuffer.push(top.node.value);
          this.indexToChild.set(this.indexToChild.size, top.node);
          top.node.key = this.indexToChild.size - 1;
        }
        top.state = "right";
        top.index = 0;
      } else if (top.state === "right") {
        if (top.index < top.node.rightChildren.length) {
          const child = top.node.rightChildren[top.index++];
          stack.push({ node: child, state: "left", index: 0 });
        } else {
          stack.pop();
        }
      }
    }

    this.content = contentBuffer.join("");
  }

  onAction(action: EditAction) {
    if (action.type === "insert") {
      const parentNode = this.idToNode.get(action.parentNodeId as string);
      invariant(parentNode, "parentNode is undefined");
      invariant(action.newNodeSide, "action.newNodeSide is undefined");

      const newNode: TreeNode = {
        id: action.newNodeId as string,
        value: action.newNodeValue as string,
        parent: parentNode,
        leftChildren: [],
        rightChildren: [],
        key: 0
      }
      this.onInsertAction(newNode, parentNode, action.newNodeSide);
    } else {
      const nodeToRemove = this.idToNode.get(action.targetNodeId as string);
      invariant(nodeToRemove, "nodeToRemove is undefined");
      this.onRemoveAction(nodeToRemove);
    }
  }
}