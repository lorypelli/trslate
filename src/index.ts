import { Call, Numbers } from 'hotscript';
export class Translation<const T extends string[], const K extends object> {
    private schema: T;
    private first: K;
    private others: object[] & { length: Call<Numbers.Sub<T['length'], 1>> };
    /**
    * The `Translation` class exports two functions, one is used to translate and the other one is used to check if a language is valid
    * @param { T } schema schema that defines the translations objects order (it must be respected for the `t` function to work properly)
    * @param { K } first the first translation object that is used to make at least one paramether required and also for types
    * @param { object[] & { length: Call<Numbers.Sub<T['length'], 1>> } others array of others objects for the translation
    */
    constructor(schema: T, first: K, ...others: object[] & { length: Call<Numbers.Sub<T['length'], 1>> }) {
        if (!Array.isArray(schema)) {
            throw new Error('Schema is not an array!');
        }
        for (let i = 0; i < schema.length; i++) {
            if (typeof schema[i] != 'string') {
                throw new Error(`The element of the schema array at index ${i} is not a valid string!`);
            }
        }
        if (new Set(schema).size != schema.length) {
            throw new Error('There are duplicated elements in the array!');
        }
        if (!first) {
            throw new Error('First object is required!');
        }
        if (typeof first != 'object') {
            throw new Error('First element is not an object!');
        }
        if (!Array.isArray(others)) {
            throw new Error('Others is not an array!');
        }
        for (let i = 0; i < others.length; i++) {
            if (typeof others[i] != 'object') {
                throw new Error(`The element of the others array at index ${i} is not a valid object!`);
            }
        }
        if (schema.length != others.length + 1) {
            throw new Error(`You passed ${schema.length} languages but you provided ${others.length + 1} objects!`);
        }
        this.schema = schema;
        this.first = first;
        this.others = others;
    }
    /**
     * The `t` function is used to make the actual translation
     * @param { T[number] } l the language into which the translation will be made
     * @param { SKey<K> } s valid strings key of the source object
     * @param { Valid[] } a args to pass that will replace `{}` to make variables working
     * @returns { string } the translated string
     */
    t(l: T[number], s: SKey<K>, ...a: Valid[]): string {
        if (typeof l != 'string') {
            throw new Error('The language is not a valid string!');
        }
        if (!this.schema.includes(l)) {
            throw new Error('No translation found for the given language!');
        }
        if (typeof s != 'string') {
            throw new Error('The key is not a valid string!');
        }
        if (l == this.schema[0]) {
            if (this.first && typeof this.first == 'object') {
                const arr = s.split('.');
                const v = arr.reduce<string | object>((o, k) => {
                    if (typeof o == 'object' && k in o) {
                        return o[k as keyof typeof o];
                    }
                    return {};
                }, this.first);
                if (typeof v == 'string') {
                    if (v.includes('{')) {
                        let str = v;
                        let c = 0;
                        str = v.replace(/\{.*?\}/g, () => {
                            let r = a[c];
                            while (r == null) {
                                if (a.length - 1 < c) {
                                    r = '';
                                }
                                else {
                                    r = a[c + 1];
                                    c++;
                                }
                            }
                            c++;
                            if (r) {
                                return r.toString();
                            }
                            return '';
                        });
                        return str;
                    }
                    return v;
                }
            }
        }
        for (let i = 0; i < this.schema.length; i++) {
            if (l == this.schema[i]) {
                for (let c = 0; c < this.others.length; c++) {
                    if (c == i - 1) {
                        const arr = s.split('.');
                        const v = arr.reduce<string | object>((o, k) => {
                            if (typeof o == 'object' && k in o) {
                                return o[k as keyof typeof o];
                            }
                            return {};
                        }, this.others[i - 1]);
                        if (typeof v == 'string') {
                            if (v.includes('{')) {
                                let str = v;
                                let c = 0;
                                str = v.replace(/\{.*?\}/g, () => {
                                    let r = a[c];
                                    while (r == null) {
                                        if (a.length - 1 < c) {
                                            r = '';
                                        }
                                        else {
                                            r = a[c + 1];
                                            c++;
                                        }
                                    }
                                    c++;
                                    if (r) {
                                        return r.toString();
                                    }
                                    return '';
                                });
                                return str;
                            }
                            return v;
                        }
                    }
                }
            }
        }
        return ''
    }
    /**
     * The `isValidLang` function is used to check if a language is valid
     * @param { string } l the language to check
     * @returns { boolean } boolean value that rappresents if the language is valid or not
     */
    isValidLang(l: string): l is T[number] {
        if (typeof l != 'string') {
            throw new Error('The language is not a valid string!');
        }
        return this.schema.includes(l as T[number]);
    }
    /**
     * The `useLang` function is a shortcut that returns a function to not specify the language every time
     * @param { T[number] } l the language into which the translation will be made
     * @returns { string } the translated string
     */
    useLang(l: T[number]): (s: SKey<K>, ...a: Valid[]) => string {
        return (s, ...a) => {
            return this.t(l, s, ...a);
        };
    }
}
type SKey<T> = { [K in Extract<keyof T, string>]: T[K] extends string ? K : T[K] extends object ? `${K}.${SKey<T[K]>}` : never }[Extract<keyof T, string>];
type Valid = string | number | boolean | null;