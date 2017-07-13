import React from 'react';

import createBus, { Bus } from './createBus';
import { Maybe } from './';

export type ThemeProviderProps<T> = {
  theme: T;
  children?: React.ReactNode;
};

export default class ThemeProvider<T> extends React.Component<ThemeProviderProps<T>, {}> {
  bus: Bus<T>;
  context: { houndstooth: Maybe<Bus<T>> };

  constructor(props: ThemeProviderProps<T>) {
    super(props);
    this.bus = createBus(props.theme);
  }

  getChildContext() {
    return {
      houndstooth: this.bus,
    };
  }

  componentWillMount() {
    if (this.context.houndstooth) {
      this.bus.set(this.props.theme);
    }
  }

  componentWillReceiveProps(nextProps: ThemeProviderProps<T>) {
    if (this.context.houndstooth) {
      this.bus.set(nextProps.theme);
    }
  }

  render() {
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}
