export default function check(schema: string[], args: object[]) {
    if (!Array.isArray(schema)) {
        throw new Error('Schema is not an array!');
    }
    for (let i = 0; i < schema.length; i++) {
        if (typeof schema[i] != 'string') {
            throw new Error(
                `The element of the schema array at index ${i} is not a valid string!`,
            );
        }
    }
    if (new Set(schema).size != schema.length) {
        throw new Error('There are duplicated elements in the array!');
    }
    if (!Array.isArray(args)) {
        throw new Error('args is not an array!');
    }
    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] != 'object') {
            throw new Error(
                `The element of the args array at index ${i} is not a valid object!`,
            );
        }
    }
    if (schema.length != args.length) {
        throw new Error(
            `You passed ${schema.length} languages but you provided ${args.length} objects!`,
        );
    }
}
