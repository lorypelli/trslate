import type { Options, Union, Valid } from './types/index';
import check from './utils/check';
import defaultOptions from './utils/default';
import getVariables from './utils/getVariables';
import isValidKey from './utils/isValidKey';

export class TContext<const T extends string[], const K extends object[]> {
    #schema: T;
    #args: K & { length: T['length'] };
    #options: Options;
    /**
     * The `TContext` class exports three main functions, the first one is used to translate, the second one is used to check if a language is valid and the third one is a shortcut to not specify the language every time in the first one. There is also another function which allows you to turn strict mode on and off
     * @param schema Array of languages names
     * @param args Objects of languages source strings
     */
    constructor(schema: T, ...args: K & { length: T['length'] }) {
        check(schema, args);
        this.#schema = schema;
        this.#args = args;
        this.#options = defaultOptions;
    }
    /**
     * The `setStrict` function allows you to set if using strict mode or not
     * @param m The value of the strict mode
     */
    setStrict(m: boolean) {
        this.#options.strict = m;
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
        if (this.#options.strict && !this.#schema.includes(l)) {
            throw new Error('No translations found for the given language!');
        }
        if (typeof s != 'string') {
            throw new Error('The key is not a valid string!');
        }
        for (let i = 0; i < this.#schema.length; i++) {
            if (l == this.#schema[i]) {
                const arr = s.split('.');
                const v = arr.reduce<string | object>((o, k) => {
                    if (typeof o == 'object' && isValidKey(k, o)) {
                        return o[k];
                    }
                    return {};
                }, this.#args[i]);
                if (typeof v == 'string') {
                    return getVariables(v, ...a);
                }
            }
        }
        if (this.#options.strict) {
            throw new Error('No translations found for the given key!');
        }
        return '';
    }
    /**
     * The `isValidLang` function indicate if a language is valid or not
     * @param l The language to check if it is valid
     * @returns boolean to indicate if it is valid or not
     */
    isValidLang(l: string): l is T[number] {
        if (typeof l != 'string') {
            throw new Error('The language is not a valid string!');
        }
        return this.#schema.includes(l);
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
        fn.setLang = (l: T[number]) => (lang = l);
        return fn;
    }
}
