/// <reference types="react" />
import React from 'react';
import { Bus } from './createBus';
import { Maybe } from './';
export declare type ThemeProviderProps<T> = {
    theme: T;
    children?: React.ReactNode;
};
export default class ThemeProvider<T> extends React.Component<ThemeProviderProps<T>, {}> {
    bus: Bus<T>;
    context: {
        houndstooth: Maybe<Bus<T>>;
    };
    constructor(props: ThemeProviderProps<T>);
    getChildContext(): {
        houndstooth: Bus<T>;
    };
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: ThemeProviderProps<T>): void;
    render(): React.ReactElement<any> | null;
}
