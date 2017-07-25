import stylis from 'stylis';

import DLLCache from './DLLCache';

export type ServerRule = {
  type: 'server';
  className: string;
  content: string;
  style: string;
};

export type ClientRule = {
  type: 'client';
  className: string;
  content: string;
  style: HTMLStyleElement;
};

export type CSSRule = ServerRule | ClientRule;

export default class StyleSheet {
  cache: DLLCache<CSSRule>;
  server: boolean;

  constructor(args?: { server?: boolean }) {
    this.cache = new DLLCache<CSSRule>();
    this.server = !!(args && args.server) || typeof document === 'undefined';
  }

  collectStyles(): string {
    const styles: string[] = [];

    this.cache.forEach(rule => {
      if (rule.value.type === 'client') {
        styles.push(rule.value.style.innerHTML);
      } else {
        styles.push(rule.value.style);
      }
    });

    return styles.join('\n');
  }

  has(className: string): boolean {
    return !!this.cache.get(className);
  }

  inject(className: string, content: string, after?: string): CSSRule {
    const rule: CSSRule = this.server
      ? {
          className,
          content,
          type: 'server',
          style: '',
        }
      : {
          className,
          content,
          type: 'client',
          style: document.createElement('style'),
        };

    const styleContent = stylis(`.${rule.className}`, rule.content);

    if (rule.type === 'server') {
      rule.style = styleContent;
    } else {
      rule.style.innerHTML = styleContent;
    }

    let afterNode = after ? this.cache.get(after) : null;

    if (afterNode) {
      this.cache.appendAfter(afterNode, rule.className, rule);

      if (rule.type === 'client' && afterNode.value.type === 'client') {
        afterNode.value.style.insertAdjacentElement('afterend', rule.style);
      }
    } else {
      this.cache.append(rule.className, rule);

      if (rule.type === 'client') {
        document.head.appendChild(rule.style);
      }
    }

    return rule;
  }

  replace(rule: CSSRule, className: string, content: string): CSSRule {
    if (rule.type === 'client') {
      rule.style.innerHTML = stylis(`.${className}`, content);
    }

    return rule;
  }
}
