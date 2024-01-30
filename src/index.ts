export class Translations<T> {
    private schema: string[];
    private first: T;
    private others: object[];
    constructor(schema: string[], first: T, ...others: object[]) {
        this.schema = schema;
        this.first = first;
        this.others = others;
    }
    t(l: string, s: SKey<T>, ...a: string[]) {
        for (let i = 0; i < this.schema.length; i++) {
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
                    return '';
                }
            }
            else if (l == this.schema[i]) {
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
                        return '';
                    }
                    return '';
                }
            }
        }
    }
}
type SKey<T> = { [K in Extract<keyof T, string>]: T[K] extends string ? K : T[K] extends object ? `${K}.${SKey<T[K]>}` : never }[Extract<keyof T, string>]