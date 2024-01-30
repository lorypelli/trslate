# trslate
this package exports a `Translation` class that is used to make translations

## Example

```js
import { Translation } from 'trslate'
const schema = []
const first = {}
const others = {}
const translate = new Translation(schema, first, others, ...)
```

this is a code to demostrate how it works, the class accept a minimum of two paramethers, the first one is a schema which indicates the order of objects, the other one is the first object which is used to have at least one object required and for types, you can pass how many params you want because the others paramethers will be interpreted as `others`. Obviously if you pass a new param, you will need to add a new `string` element in the `schema` paramether.

---
`t` function:<br>
is the actual function used to translate

## Example

```js
const lang = ''
const key = ''
console.log(translate.t(lang, key))
```

the `t` function accept two paramethers, the first one is the language you want to translate into and the second one is the object key from which to take the string that will be translated