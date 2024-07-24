export function check(schema: string[], ...others: object[]) {
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
    if (!Array.isArray(others)) {
        throw new Error('Others is not an array!');
    }
    for (let i = 0; i < others.length; i++) {
        if (typeof others[i] != 'object') {
            throw new Error(
                `The element of the others array at index ${i} is not a valid object!`,
            );
        }
    }
    if (schema.length != others.length) {
        throw new Error(
            `You passed ${schema.length} languages but you provided ${others.length} objects!`,
        );
    }
}
