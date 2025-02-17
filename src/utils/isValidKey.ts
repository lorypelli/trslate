export default function isValidKey(k: string, o: object): k is keyof typeof o {
    return k in o;
}
