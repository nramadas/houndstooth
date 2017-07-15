/// <reference types="react" />
import { ComponentClass } from 'react';
export declare type ThemeEnhancedProps<P, T> = P & {
    theme: T;
};
export declare type ComponentCreator<P> = <T>(strings: TemplateStringsArray, ...keys: any[]) => ComponentClass<P>;
export default function styled<P extends {}>(tag: any): ComponentCreator<P>;
