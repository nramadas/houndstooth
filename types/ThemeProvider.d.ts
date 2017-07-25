/// <reference types="react" />
import React from 'react';
import PropTypes from 'prop-types';
import { Bus } from './models/bus';
import { Maybe } from './';
export declare type ThemeProviderProps = {
    theme: any;
    children?: React.ReactNode;
};
export default class ThemeProvider extends React.Component<ThemeProviderProps, {}> {
    bus: Bus<any>;
    context: {
        houndstooth: Maybe<Bus<any>>;
    };
    static childContextTypes: {
        houndstooth: PropTypes.Validator<any>;
    };
    constructor(props: ThemeProviderProps);
    getChildContext(): {
        houndstooth: Bus<any>;
    };
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: ThemeProviderProps): void;
    render(): React.ReactElement<any> | null;
}
