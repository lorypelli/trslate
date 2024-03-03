# trslate
This package exports a `TContext` class.<br>
The `TContext` class exports three functions, the first one is used to translate, the second one is used to check if a language is valid and the third one is a shortcut to not specify the lang in the first one.

## Example

```js
import { TContext } from 'trslate'
const schema = []
const first = {}
const others = {}
const translate = new TContext(schema, first, others, ...)
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

this function accept two paramethers, the first one is the language you want to translate into and the second one is the object key from which to take the string that will be translated.

---

`isValidLang` function:<br>
used to check if a language is valid

## Example

```js
const lang = ''
if (translate.isValidLang(lang)) {
    // now typescript knows that lang can only be an element of the schema array
}
```

this function accept one paramether, the language and it checks if the translation in that language was provided, it returns a boolean.

---

`useLang` function:<br>
a shortcut that returns a function to not specify the language every time

## Example

```js
const lang = ''
const t = translate.useLang(lang)
const key = ''
console.log(t(key))
```

this function accept one paramether, the language you want to translate into, and it returns a function that allows you to not specify the language everytime but only the key.