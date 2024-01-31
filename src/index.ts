/**
 * Translation class that includes the function that is responsible for translations
 * @param schema schema that defines the translations objects order (it must be respected for the `t` function to work properly)
 * @param first the first translation object that is used to make at least one paramether required and also for types
 * @param others array of others objects for the translation
 */
export class Translation<T extends string, K extends object> {
    private schema: T[];
    private first: K;
    private others: object[];
    constructor(schema: T[], first: K, ...others: object[]) {
        this.schema = schema;
        this.first = first;
        this.others = others;
        if (!Array.isArray(schema)) {
            throw new Error('Schema is not an array!');
        }
        else {
            for (let i = 0; i < schema.length; i++) {
                if (typeof schema[i] != 'string') {
                    throw new Error(`The element of the schema array at index ${i} is not a valid string!`);
                }
            }
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
        else {
            for (let i = 0; i < others.length; i++) {
                if (typeof others[i] != 'object') {
                    throw new Error(`The element of the others array at index ${i} is not a valid object!`);
                }
            }
        }
        if (schema.length != others.length + 1) {
            throw new Error(`You passed ${schema.length} languages but you provided ${others.length + 1} objects!`);
        }
    }
    /**
     * The `t` function is used to make the actual translation
     * @param l the language into which the translation will be made
     * @param s valid strings key of the source object
     * @param a args to pass that will replace `{}` to make variables working
     * @returns the translated string
     */
    t(l: T, s: SKey<K>, ...a: string[]) {
        if (!this.schema.includes(l)) {
            return '';
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
                            const r = a[c];
                            c++;
                            return r;
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
                                    const r = a[c];
                                    c++;
                                    return r;
                                });
                                return str;
                            }
                            return v;
                        }
                    }
                }
            }
        }
    }
    isValidLang(l: string): l is T {
        return this.schema.includes(l as T);
    }
}
type SKey<T> = { [K in Extract<keyof T, string>]: T[K] extends string ? K : T[K] extends object ? `${K}.${SKey<T[K]>}` : never }[Extract<keyof T, string>]