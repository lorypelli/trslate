import { Valid } from '../types/index';

export function getVariables(v: string, ...a: Valid[]) {
    if (a.length > 0 && v.includes('{{') && v.includes('}}')) {
        let str = v;
        let c = 0;
        str = v.replace(/{{.*?}}/g, () => {
            let r = a[c];
            if (!['string', 'number', 'boolean'].includes(typeof r)) {
                throw new Error(
                    'Valid types are only strings, numbers or booleans!',
                );
            }
            c++;
            return r.toString();
        });
        return str;
    }
    return v;
}
