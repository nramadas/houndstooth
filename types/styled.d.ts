/// <reference types="react" />
import { ComponentClass, StatelessComponent } from 'react';
import { StaticStyles, DynamicStyles } from './models/styles';
export declare type ThemeProps<T> = {
    theme: T;
};
export declare type Styles<P> = StaticStyles | DynamicStyles<P>;
export declare type ComponentExtras = {
    id: number;
};
export declare type Tag<P> = string | ((ComponentClass<P> | StatelessComponent<P>) & ComponentExtras);
export interface StyleMaker<P> {
    (...styles: Styles<P>[]): ComponentClass<P>;
}
export declare type StyledComponentFactory = <P>(tag: Tag<P>) => StyleMaker<P>;
export declare type ComponentStylesLookup = {
    orderedList: string[];
    unique: string[];
    lookup: Set<string>;
};
declare const styled: StyledComponentFactory;
export default styled;
