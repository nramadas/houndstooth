import { Maybe } from '../';

export class Node<T> {
  key: string;
  value: T;
  prev: Maybe<Node<T>>;
  next: Maybe<Node<T>>;

  constructor(key: string, value: T) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export default class DLLCache<T> {
  head: Maybe<Node<T>>;
  tail: Maybe<Node<T>>;
  cache: { [key: string]: Node<T> };

  constructor() {
    this.head = null;
    this.tail = null;
    this.cache = {};
  }

  append(key: string, value: T): Node<T> {
    const node = new Node(key, value);

    if (!this.tail) {
      this.tail = node;
    }
    
    if (!this.head) {
      this.head = node;
    } else {
      node.prev = this.head;
      this.head.next = node;
      this.head = node;
    }

    this.cache[key] = node;

    return node;
  }

  appendAfter(after: Node<T>, key: string, value: T): Node<T> {
    const node = new Node(key, value);

    node.next = after.next;
    node.prev = after;
    after.next = node;

    this.cache[key] = node;

    return node;
  }

  forEach(fn: (node: Node<T>) => any): void {
    let node = this.tail;

    while(node) {
      fn(node);
      node = node.next;
    }
  }

  get(key: string): Maybe<Node<T>> {
    return this.cache[key];
  }
}