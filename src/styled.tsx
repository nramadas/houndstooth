import React, { createElement, ComponentClass, StatelessComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';

import { Bus, Unsubscriber } from './createBus';
import { Maybe } from './';

export type ThemeEnhancedProps<P, T> = P & {
  theme: T;
};

export type ComponentCreator<P> = <T>(strings: TemplateStringsArray, ...keys: any[]) => ComponentClass<P>;

export default function styled<P extends {}>(tag: any): ComponentCreator<P> {
  return (strings, ...keys) => {
    class Styled<T> extends React.Component<any, { theme: Maybe<T> }> {
      context: { houndstooth: Maybe<Bus<T>> };
      cleanUp: Maybe<Unsubscriber>;

      static contextTypes = {
        houndstooth: PropTypes.object,
      };

      constructor(props: P) {
        super(props);
        this.cleanUp = null;
        this.state = {
          theme: null,
        };
      }

      componentWillMount() {
        console.log(strings, keys);
        const staticStyles = []; 
        const dynamicStyles = [];
        
        if (this.context.houndstooth) {
          this.setState({ theme: this.context.houndstooth.peek() });
        }
      }

      componentDidMount() {
        if (this.context.houndstooth) {
          this.cleanUp = this.context.houndstooth.listen(theme => {
            this.setState({ theme });
          })
        }
      }

      componentWillUnmount() {
        if (this.cleanUp) {
          this.cleanUp();
        }
      }

      render() {
        return createElement<ThemeEnhancedProps<P, T>>(
          tag,
          this.props,
        );
      }
    }

    return Styled;
  };
}
