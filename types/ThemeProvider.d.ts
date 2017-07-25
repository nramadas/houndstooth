/// <reference types="react" />
import React from 'react';
import PropTypes from 'prop-types';
import { Maybe } from './';
import { Bus } from './models/bus';
import StyleSheet from './models/StyleSheet';
export declare type ThemeProviderProps = {
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
    static childContextTypes: {
        houndstooth: PropTypes.Validator<any>;
    };
    constructor(props: ThemeProviderProps);
    getChildContext(): {
        houndstooth: {
            themeBus: Bus<any>;
            styleSheet: StyleSheet;
        };
    };
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: ThemeProviderProps): void;
    render(): React.ReactElement<any> | null;
}
