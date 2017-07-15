export declare type Listener<S> = (s: S) => void;
export declare type Unsubscriber = () => void;
export declare type Channels<S> = {
    [id: number]: Listener<S>;
};
export declare type Bus<S> = {
    peek: () => S;
    set: (s: S) => void;
    listen: (l: Listener<S>) => Unsubscriber;
};
/**
 * A simple data bus.
 */
declare const makeBus: <S>(initial: S) => Bus<S>;
export default makeBus;
