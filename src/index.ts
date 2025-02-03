import { Union, Valid } from './types/index';
import { check } from './utils/check';
import { getVariables } from './utils/getVariables';

export class TContext<const T extends string[], const K extends object[]> {
    private schema: T;
    private others: K & { length: T['length'] };
    /**
     * The `TContext` class exports three functions, the first one is used to translate, the second one is used to check if a language is valid and the third one is a shortcut to not specify the language in the first one
     */
    constructor(schema: T, ...others: K & { length: T['length'] }) {
        check(schema, others);
        this.schema = schema;
        this.others = others;
    }
    /**
     * The `t` function is used to make the actual translation
     */
    t(l: T[number], s: Union<K[number]>, ...a: Valid[]): string {
        if (typeof l != 'string') {
            throw new Error('The language is not a valid string!');
        }
        if (!this.schema.includes(l)) {
            throw new Error('No translation found for the given language!');
        }
        if (typeof s != 'string') {
            throw new Error('The key is not a valid string!');
        }
        for (let i = 0; i < this.schema.length; i++) {
            if (l == this.schema[i]) {
                for (let c = 0; c < this.others.length; c++) {
                    if (c == i) {
                        const arr = s.split('.');
                        const v = arr.reduce<string | object>((o, k) => {
                            if (typeof o == 'object' && k in o) {
                                return o[k as keyof typeof o];
                            }
                            return {};
                        }, this.others[i]);
                        if (typeof v == 'string') {
                            return getVariables(v, ...a);
                        }
                    }
                }
            }
        }
        return '';
    }
    isValidLang(l: string): l is T[number] {
        if (typeof l != 'string') {
            throw new Error('The language is not a valid string!');
        }
        return this.schema.includes(l);
    }
    /**
     * The `useLang` function is a shortcut that returns a function to not specify the language every time
     */
    useLang(l: T[number]): (s: Union<K[number]>, ...a: Valid[]) => string {
        return (s, ...a) => this.t(l, s, ...a);
    }
}
