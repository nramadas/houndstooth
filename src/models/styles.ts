export type Value = string | number | StaticStyles;
export type StaticStyles =  { [property: string]: Value };
export type DynamicStyles<P> = (props: P) => StaticStyles;
