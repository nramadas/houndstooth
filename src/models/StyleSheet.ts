import stylis from 'stylis';

import DLLCache from './DLLCache';

export type CSSRule = {
  className: string;
  content: string;
  styleTag: HTMLStyleElement;
};

export default class StyleSheet {
  cache: DLLCache<CSSRule>;

  constructor() {
    this.cache = new DLLCache<CSSRule>();
  }

  has(className: string): boolean {
    return !!this.cache.get(className);
  }

  inject(className: string, content: string, after?: string): CSSRule {    
    const rule = {
      className,
      content,
      styleTag: document.createElement('style'),
    };

    rule.styleTag.innerHTML = stylis(`.${rule.className}`, rule.content);

    let afterNode = after ? this.cache.get(after) : null;

    if (afterNode) {
      this.cache.appendAfter(afterNode, rule.className, rule);
      afterNode.value.styleTag.insertAdjacentElement('afterend', rule.styleTag);
    } else {
      this.cache.append(rule.className, rule);
      document.head.appendChild(rule.styleTag);
    }

    return rule;
  }

  replace(rule: CSSRule, className: string, content: string): CSSRule {
    rule.styleTag.innerHTML = stylis(`.${className}`, content);
    return rule;
  }
}
