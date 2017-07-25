import { Maybe } from '../';
export declare class Node<T> {
    key: string;
    value: T;
    prev: Maybe<Node<T>>;
    next: Maybe<Node<T>>;
    constructor(key: string, value: T);
}
export default class DLLCache<T> {
    head: Maybe<Node<T>>;
    tail: Maybe<Node<T>>;
    cache: {
        [key: string]: Node<T>;
    };
    constructor();
    append(key: string, value: T): Node<T>;
    appendAfter(after: Node<T>, key: string, value: T): Node<T>;
    forEach(fn: (node: Node<T>) => any): void;
    get(key: string): Maybe<Node<T>>;
}
