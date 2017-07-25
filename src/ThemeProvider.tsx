import React from 'react';
import PropTypes from 'prop-types';

import { Maybe } from './';
import { createBus, Bus } from './models/bus';
import StyleSheet from './models/StyleSheet';

export type ThemeProviderProps = {
  children?: React.ReactNode;
  theme: any;
  styleSheet: StyleSheet;
};

export default class ThemeProvider extends React.Component<ThemeProviderProps, {}> {
  bus: Bus<any>;
  context: { 
    houndstooth: {
      themeBus: Maybe<Bus<any>>; 
      styleSheet: StyleSheet;
    };
  };

  static childContextTypes = {
    houndstooth: PropTypes.object.isRequired,
  };

  constructor(props: ThemeProviderProps) {
    super(props);
    this.bus = createBus(props.theme);
  }

  getChildContext() {
    return {
      houndstooth: {
        themeBus: this.bus,
        styleSheet: this.props.styleSheet,
      },
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
