import DLLCache from './DLLCache';
export declare type ServerRule = {
    type: 'server';
    className: string;
    content: string;
    style: string;
};
export declare type ClientRule = {
    type: 'client';
    className: string;
    content: string;
    style: HTMLStyleElement;
};
export declare type CSSRule = ServerRule | ClientRule;
export default class StyleSheet {
    cache: DLLCache<CSSRule>;
    server: boolean;
    constructor(args?: {
        server?: boolean;
    });
    collectStyles(): string;
    has(className: string): boolean;
    inject(className: string, content: string, after?: string): CSSRule;
    replace(rule: CSSRule, className: string, content: string): CSSRule;
}
