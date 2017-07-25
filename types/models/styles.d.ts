export declare type Value = string | number | StaticStyles;
export declare type StaticStyles = {
    [property: string]: Value;
};
export declare type DynamicStyles<P> = (props: P) => StaticStyles;
