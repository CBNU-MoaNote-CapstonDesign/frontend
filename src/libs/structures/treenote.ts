import {TreeNode} from "@/types/treenode";
import {CRDTOperation} from "@/types/crdtOperation";
import invariant from "tiny-invariant";
import {TreeNodeDTO} from "@/types/dto";
import {codeText} from "micromark-core-commonmark";


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
 * - insert(insertAt: number, value: string)
 * - remove(removeAt: number, removeLength: number = 1)
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
  operationHistories: CRDTOperation[][] = [[]];

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
      successor: null,
      leftChildren: [],
      rightChildren: [],
      key: 0
    };
    let curr = _root;
    _indexToChild.set(-1, _root);
    _idToNode.set(_root.id, _root);
    for (let i = 0; i < _content.length; i++) {
      const node: TreeNode = {
        id: String(i + 1),
        value: _content[i],
        parent: curr,
        leftChildren: [],
        rightChildren: [],
        key: i
      };
      curr.successor = node;
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
   * @param rootDTO root node of tree based document
   * @param nodesDTO all nodes of tree based document
   */
  static fromTree(uuid: string, id: string, title: string, rootDTO: TreeNodeDTO, nodesDTO: TreeNodeDTO[]) {
    const root: TreeNode = {
      id: rootDTO.id,
      leftChildren: [],
      rightChildren: [],
      value: rootDTO.value
    };

    const nodes: TreeNode[] = [];
    const _idToNode = new Map<string, TreeNode>();
    for (let i = 0; i < nodesDTO.length; i++) {
      const nodeDTO = nodesDTO[i];
      let node: TreeNode;
      if (nodeDTO.parentId == null) {
        nodes.push(root);
        node = root;
      } else {
        node = {
          id: nodeDTO.id,
          leftChildren: [],
          rightChildren: [],
          value: nodeDTO.value
        };
        nodes.push(node);
      }
      _idToNode.set(node.id, node);
    }


    for (let i = 0; i < nodesDTO.length; i++) {
      if (nodesDTO[i].parentId == null)
        continue;
      if (nodesDTO[i].side == "LEFT")
        _idToNode.get(nodesDTO[i].parentId)?.leftChildren.push(nodes[i]);
      else
        _idToNode.get(nodesDTO[i].parentId)?.rightChildren.push(nodes[i]);
    }

    const _id = id;
    const _title = title;
    const _indexToChild = new Map<number, TreeNode>();

    const tree: TreeNote = new TreeNote(uuid, _id, _title, "", root, nodesDTO.length, _indexToChild, _idToNode);
    tree.traversal();
    return tree;
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
    return node.successor ? node.successor : undefined;
  }

  insert(insertAt: number, value: string) {
    const previousNode = this.getNodeByIndex(insertAt - 1);
    invariant(previousNode, "previousNode is undefined");
    const successor = this.getSuccessor(previousNode);

    let newNode: TreeNode = {
      id: this.uuid + this.size.toString(),
      value: value[0],
      parent: null,
      successor: null,
      leftChildren: [],
      rightChildren: [],
      key: this.indexToChild.size + 1 // 해당 key 는 의미를 가지지 않음
    };

    if (previousNode.rightChildren.length == 0) {
      newNode.parent = previousNode;
      this.onInsertAction(newNode, previousNode, "right");
      this.operationHistories[this.operationHistories.length - 1].push({
        type: "INSERT",
        nodeId: newNode.id,
        value: newNode.value as string,
        parentId: newNode.parent.id,
        side: "RIGHT",
        byWho: this.uuid
      });
    } else {
      invariant(successor, "successor is undefined");
      newNode.parent = successor;
      this.onInsertAction(newNode, successor, "left");
      this.operationHistories[this.operationHistories.length - 1].push({
        type: "INSERT",
        nodeId: newNode.id,
        value: newNode.value as string,
        parentId: newNode.parent.id,
        side: "LEFT",
        byWho: this.uuid
      });
    }


    for (let i = 1; i < value.length; i++) {
      const nextNode: TreeNode = {
        id: this.uuid + this.size.toString(),
        value: value[i],
        parent: newNode,
        successor: null,
        leftChildren: [],
        rightChildren: [],
        key: this.indexToChild.size + 1 // 해당 key 는 의미를 가지지 않음
      };
      newNode = nextNode;
      invariant(newNode.parent, "newNode.parent is undefined");
      this.onInsertAction(newNode, newNode.parent, "right");
      this.operationHistories[this.operationHistories.length - 1].push({
        type: "INSERT",
        nodeId: newNode.id,
        value: newNode.value as string,
        parentId: newNode.parent.id,
        side: "RIGHT",
        byWho: this.uuid
      });
    }
  }

  onInsertAction(newNode: TreeNode, parent: TreeNode, side: "left" | "right") {
    this.size++;
    this.idToNode.set(newNode.id, newNode);
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
  }

  remove(removeAt: number, removeLength: number = 1) {
    for (let i = removeAt; i < removeAt + removeLength; i++) {
      const nodeToRemove = this.getNodeByIndex(i);
      invariant(nodeToRemove, "nodeToRemove is undefined");
      this.onRemoveAction(nodeToRemove);
      this.operationHistories[this.operationHistories.length - 1].push({
        type: "REMOVE",
        nodeId: nodeToRemove.id,
        byWho: this.uuid
      });
    }
  }

  onRemoveAction(node: TreeNode) {
    invariant(node.key !== undefined, "node.key is undefined");
    invariant(node.key !== null, "node.key is null");
    if (node.value === null || node.value === undefined) {
      return;
    }
    node.value = null;
  }

  /**
   * 트리를 순회하여 insert 와 remove 로 인해 추가된 노드들을 처리하는 메소드
   * remove 와 insert action 을 수행하였다면 실제로 적용하기 위해서는 이 메소드를 호출해야 함
   */
  traversal() {
    this.operationHistories.push([]);
    const contentBuffer: string[] = [];
    this.indexToChild = new Map<number, TreeNode>();
    this.indexToChild.set(-1, this.root);

    let lastVisit = null;

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
        if (lastVisit)
          lastVisit.successor = top.node;
        lastVisit = top.node;
        if (top.node.value !== null && top.node.value !== undefined) {
          contentBuffer.push(top.node.value);
          this.indexToChild.set(this.indexToChild.size - 1, top.node);
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

  onAction(action: CRDTOperation) {
    if (action.type === "INSERT") {
      const parentNode = this.idToNode.get(action.parentId as string);
      if (parentNode === undefined) {
        return;
      }
      const newNode: TreeNode = {
        id: action.nodeId as string,
        value: action.value as string,
        parent: parentNode,
        leftChildren: [],
        rightChildren: [],
        key: 0
      }
      this.onInsertAction(newNode, parentNode, action.side === "LEFT" ? "left" : "right");
    } else {
      const nodeToRemove = this.idToNode.get(action.nodeId as string);
      if (nodeToRemove === undefined) {
        return;
      }
      this.onRemoveAction(nodeToRemove);
    }
  }
}