type SKey<T> = {
    [K in keyof T & string]: T[K] extends string
        ? K
        : T[K] extends object
          ? `${K}.${SKey<T[K]>}`
          : never;
}[keyof T & string];

export type Union<T> = T extends object ? SKey<T> : never;

export type Valid = string | number | boolean;
