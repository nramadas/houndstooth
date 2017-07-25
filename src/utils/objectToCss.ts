import { StaticStyles } from '../models/styles';

const keyToCssRule = (key: string): string => key
  .replace(/([A-Z])/g, '-$1')
  .toLowerCase()
  .replace(/^ms-/, '-ms');

const objectToCss = (obj: StaticStyles): string => {
  return Object
    .keys(obj)
    .map(key => {
      const value = obj[key];
      if (typeof value === 'object') {
        return `${key} {\n  ${objectToCss(value)}\n}`;
      }
      return `${keyToCssRule(key)}: ${value};`;
    })
    .join('\n');
};

export default objectToCss;
