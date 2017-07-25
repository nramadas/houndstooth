import React, { createElement, ComponentClass, StatelessComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';

import { Maybe } from './';
import { Bus, Unsubscriber } from './models/bus';
import { StaticStyles, DynamicStyles } from './models/styles';
import StyleSheet, { CSSRule } from './models/StyleSheet';
import objectToCss from './utils/objectToCss';
import hash from './utils/hash';

export type ThemeProps<T> = { theme: T };
export type Styles<P> = StaticStyles | DynamicStyles<P>;
export type ComponentExtras = { id: number };
export type Tag<P> = string | ((ComponentClass<P> | StatelessComponent<P>) & ComponentExtras);

export interface StyleMaker<P> {
  (...styles: Styles<P>[]): ComponentClass<P>
};

export type StyledComponentFactory = <P>(tag: Tag<P>) => StyleMaker<P>;
export type ComponentStylesLookup = {
  orderedList: string[];
  unique: string[];
  lookup: Set<string>;
};

function isComponentStateless(comp: ComponentClass<any> | StatelessComponent<any>): comp is StatelessComponent<any> {
  return !comp.prototype.render;
}

function areStylesStatic(styles: StaticStyles | DynamicStyles<any>): styles is StaticStyles {
  return typeof styles === 'object';
}

function areStylesDynamic(styles: StaticStyles | DynamicStyles<any>): styles is DynamicStyles<any> {
  return typeof styles === 'function';
}

let id = 0;
const COMPONENT_ID_TO_CLASSNAMES: { [id: number]: ComponentStylesLookup } = {};
const STYLE_SHEET = new StyleSheet();

const styled: StyledComponentFactory = tag => (...styles) => {
  let visited = false;
  let staticClassNames: string[] = [];
  let dynamicRules: CSSRule[] = [];

  return class Styled<P, T> extends React.Component<any, ThemeProps<Maybe<T>>> {
    context: { houndstooth: Maybe<Bus<T>> };
    className: string;
    cleanUp: Maybe<Unsubscriber>;

    static contextTypes = {
      houndstooth: PropTypes.object,
    };

    static id = id++;

    constructor(props: any) {
      super(props);
      this.state = {
        theme: null
      };
    }

    componentWillMount() {
      if (this.context.houndstooth) {
        const theme = this.context.houndstooth.peek();

        this.setState({
          theme,
        });
      }
    }

    componentDidMount() {
      if (this.context.houndstooth) {
        this.cleanUp = this.context.houndstooth.listen(theme => {
          this.setState({
            theme,
          });
        });
      }
    }

    componentWillUnmount() {
      if (this.cleanUp) this.cleanUp();
    }

    shouldComponentUpdate(nextProps: P, nextState: ThemeProps<Maybe<T>>): boolean {
      if (nextState.theme !== this.state.theme) return true;
      if (nextProps === this.props) return false;
      if (Object.keys(nextProps).length !== Object.keys(this.props).length) return true;
      for (const key in nextProps) {
        if (nextProps[key] !== this.props[key]) return true;
      }
      return false;
    }

    generateClassName(theme: Maybe<T>) {
      const staticStyles = styles.filter(areStylesStatic);
      const dynamicStyles = styles.filter(areStylesDynamic);
      let classNames: string[] = [];

      let inheritingComponentStyles: Maybe<ComponentStylesLookup> = typeof tag !== 'string'
        ? COMPONENT_ID_TO_CLASSNAMES[tag.id]
        : null;

      let after: string | undefined = inheritingComponentStyles
        ? inheritingComponentStyles.orderedList[inheritingComponentStyles.orderedList.length - 1]
        : undefined;

      if (visited) {
        classNames = classNames.concat(staticClassNames);
      } else {
        visited = true;

        staticStyles
          .forEach(styles => {
            const css = objectToCss(styles);
            const className = `h-${hash(css)}`;
            classNames.push(className);
            staticClassNames.push(className);

            const rule = STYLE_SHEET.inject(className, css, after);
            after = rule.className;
          });
      }

      dynamicStyles
        .forEach((styles, index) => {
          const css = objectToCss(styles({ ...this.props, theme: theme || {} }));
          const className = `h-${hash(css)}`;
          classNames.push(className);

          if (dynamicRules[index]) {
            dynamicRules[index] = STYLE_SHEET.replace(dynamicRules[index], className, css);
          } else {
            const rule = STYLE_SHEET.inject(className, css, after);
            after = rule.className;
            dynamicRules.push(rule);
          }
        });

      const uniqueClassNames = inheritingComponentStyles
        ? classNames.filter(str => !inheritingComponentStyles!.lookup.has(str))
        : classNames;

      const totalClassNames = inheritingComponentStyles
        ? inheritingComponentStyles.orderedList.concat(uniqueClassNames)
        : classNames;

      COMPONENT_ID_TO_CLASSNAMES[Styled.id] = {
        orderedList: uniqueClassNames,
        unique: uniqueClassNames,
        lookup: new Set(totalClassNames),
      };

      return uniqueClassNames;
    }

    render() {
      const { className } = this.props;
      const computedClassNames = this.generateClassName(this.state.theme);
      const classNameSum = computedClassNames.concat(className).join(' ');

      const baseProps = {
        ...this.props,
        className: classNameSum,
      };

      if (typeof tag === 'string') return createElement<any, HTMLElement>(tag, baseProps);

      const componentProps = {
        ...baseProps,
        theme: this.state.theme,
      };

      if (isComponentStateless(tag)) return createElement(tag, componentProps);
      return createElement(tag, componentProps);
    }
  }
};

export default styled;
