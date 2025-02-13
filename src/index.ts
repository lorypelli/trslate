import { Union, Valid } from './types/index';
import { check } from './utils/check';
import { getVariables } from './utils/getVariables';
import { isValidKey } from './utils/isValidKey';

export class TContext<const T extends string[], const K extends object[]> {
    private schema: T;
    private others: K & { length: T['length'] };
    /**
     * The `TContext` class exports three functions, the first one is used to translate, the second one is used to check if a language is valid and the third one is a shortcut to not specify the language every time in the first one
     * @param schema Array of languages names
     * @param others Objects of languages source strings
     */
    constructor(schema: T, ...others: K & { length: T['length'] }) {
        check(schema, others);
        this.schema = schema;
        this.others = others;
    }
    /**
     * The `t` function is used to make the actual translation
     * @param l The language to translate into
     * @param s The key to translate
     * @param a Variables that replace `{{}}` sintax
     * @returns The translated string
     */
    t(l: T[number], s: Union<K[number]>, ...a: Valid[]) {
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
                const arr = s.split('.');
                const v = arr.reduce<string | object>((o, k) => {
                    if (typeof o == 'object' && isValidKey(k, o)) {
                        return o[k];
                    }
                    return {};
                }, this.others[i]);
                if (typeof v == 'string') {
                    return getVariables(v, ...a);
                }
            }
        }
        return '';
    }
    /**
     *
     * @param l The language to check if it is valid
     * @returns boolean to indicate if it is valid or not
     */
    isValidLang(l: string): l is T[number] {
        if (typeof l != 'string') {
            throw new Error('The language is not a valid string!');
        }
        return this.schema.includes(l);
    }
    /**
     * The `useLang` function is a shortcut that returns a function to not specify the language every time
     * @param l The language to translate into
     * @returns A function where you don't need to specify the language
     */
    useLang(l: T[number]) {
        let lang = l;
        const fn = (s: Union<K[number]>, ...a: Valid[]) =>
            this.t(lang, s, ...a);
        /**
         * The `setLang` function allows you to change the language without creating another function
         * @param l The new language
         */
        fn.setLang = (l: T[number]) => {
            lang = l;
        };
        return fn;
    }
}
