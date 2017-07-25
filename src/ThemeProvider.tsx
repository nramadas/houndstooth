import React from 'react';
import PropTypes from 'prop-types';

import { createBus, Bus } from './models/bus';
import { Maybe } from './';

export type ThemeProviderProps = {
  theme: any;
  children?: React.ReactNode;
};

export default class ThemeProvider extends React.Component<ThemeProviderProps, {}> {
  bus: Bus<any>;
  context: { houndstooth: Maybe<Bus<any>> };

  static childContextTypes = {
    houndstooth: PropTypes.object.isRequired,
  };

  constructor(props: ThemeProviderProps) {
    super(props);
    this.bus = createBus(props.theme);
  }

  getChildContext() {
    return {
      houndstooth: this.bus,
    };
  }

  componentWillMount() {
    this.bus.set(this.props.theme);
  }

  componentWillReceiveProps(nextProps: ThemeProviderProps) {
    this.bus.set(nextProps.theme);
  }

  render() {
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}
