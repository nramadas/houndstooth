import DLLCache from './DLLCache';
export declare type CSSRule = {
    className: string;
    content: string;
    styleTag: HTMLStyleElement;
};
export default class StyleSheet {
    cache: DLLCache<CSSRule>;
    constructor();
    has(className: string): boolean;
    inject(className: string, content: string, after?: string): CSSRule;
    replace(rule: CSSRule, className: string, content: string): CSSRule;
}
