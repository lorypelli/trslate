import { Valid } from '../types/index';

export function getVariables(v: string, ...a: Valid[]) {
    if (v.includes('{')) {
        let str = v;
        let c = 0;
        str = v.replace(/{{.*?}}/g, () => {
            let r = a[c];
            while (r == null) {
                if (a.length - 1 < c) {
                    r = '';
                } else {
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
