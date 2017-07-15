const _ = require('lodash');

const zip = (arr1, arr2) => {
  const result = [];
  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    if (arr1[i]) result.push(arr1[i]);
    if (arr2[i]) result.push(arr2[i]);
  }
  return result;
};

module.exports = function (babel) {
  const { types } = babel;

  return {
    name: 'houndstooth',
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      TaggedTemplateExpression(path, state) {
        // console.log(path, state);
        const { node } = path;
        const { quasis, expressions } = node.quasi;
        // console.log('node:', node);
        // console.log('quasi:', node.quasi);
        // console.log(node);
        // node.quasi.quasis.forEach(elem => {
        //   console.log(elem.value);
        // })
        const isCompleteRule = new RegExp('(.+):(\\s*)(\\S+)');
        const staticRules = [];
        const dynamicRules = [];
        const prev = [];

        const properties = zip(quasis, expressions)
          .map(item => {
            if (types.isTemplateElement(item)) {
              return item.value.raw
                .split('\n')
                .map(str => str.trim());
            } else {
              return item;
            }
          })
          .reduce((acc, item) => {
            return acc.concat(item);
          }, []);

        const staticProperties = types.objectExpression(
          properties
            .filter(x => typeof x === 'string')
            .filter(x => isCompleteRule.test(x))
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .map(str => {
              const [prop, assignment] = str.replace(';', '').split(':');
              const key = _.camelCase(prop).trim();
              const value = assignment.trim();
              return types.objectProperty(
                types.stringLiteral(key), 
                types.stringLiteral(value)
              );
            })
        );

        console.log(staticProperties);

        const unAccountedItems = properties
          .filter(x => {
            if (!x) return false;
            if (typeof x === 'string') return !isCompleteRule.test(x);
            return true;
          });

        console.log(unAccountedItems);
    
        // zip(quasis, expressions).forEach(item => {
        //   if (types.isFunctionExpression(item) ||
        //       types.isArrowFunctionExpression(item)) {
        //     // console.log("function", item);
        //     // console.log(item);
        //     if (!prev.length) {

        //     }
        //   }
        //   else if (types.isTemplateElement(item)) {
        //     // console.log('template string:', item.value.raw);
        //     item.value.raw
        //       .split('\n')
        //       .forEach(str => {
        //         const rule = str.trim();

        //         if (isCompleteRule.test(rule)) {
        //           const [name, value] = rule.replace(';', '').split(':');
        //           const cssRule = _.camelCase(name).trim();
        //           const cssValue = value.trim();

        //           staticRules.push({
        //             key: cssRule,
        //             value: cssValue,
        //           });
        //           // staticRules.push(types.objectProperty(types.stringLiteral(cssRule), types.stringLiteral(cssValue)));
        //         } else {
        //           console.log('incomplete:', rule);
        //           if (rule === ';') {
        //             // flush out prev
        //             prev = [];
        //           } else if (!prev.length) {
        //             prev.push({
        //               type: 'key',
        //               value: rule.trim().replace(':', ''),
        //             });
        //           } else {
        //             console.log(prev);
        //             throw new Error('there was a prev?');
        //           }
        //         }
        //       });

        //   }
        //   else {
        //     console.log(item);
        //   }
        // });

        // const staticProps = types.objectExpression(
        //   staticRules
        //     .sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase()))
        //     .map(rule => types.objectProperty(
        //       types.stringLiteral(rule.key),
        //       types.stringLiteral(rule.value)
        //     ))
        // );

        // console.log(staticProps);
        // path.replaceWith(staticProps);
      },
    }
  };
}
