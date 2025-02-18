# trslate

This package exports a `TContext` class<br>
The `TContext` class exports three main functions, the first one is used to translate, the second one is used to check if a language is valid and the third one is a shortcut to not specify the language every time in the first one. There is also another function which allows you to toggle strict mode

## Example

```js
import { TContext } from 'trslate';
const schema = [];
const translate = new TContext(schema, ...);
```

this is a code to demostrate how it works, the class accept a minimum of one param, every other param you pass is the corresponding translation object for every language in the `schema`. Obviously if you pass a new param, you will need to add a new `string` element in the array

---

`setStrict` function:<br>
This function allows you to toggle strict mode

## Example

```js
let m = true;
const lang = 'invalid';
const key = 'invalid';
translate.setStrict(m);
translate.t(lang, key); // gives error
m = false;
translate.setStrict(m);
translate.t(lang, key); // doesn't give error
```

---

`t` function:<br>
is the actual function used to translate

## Example

```js
const lang = '';
const key = '';
console.log(translate.t(lang, key));
```

this function accept two paramethers, the first one is the language you want to translate into and the second one is the object key from which to take the string that will be translated

---

`isValidLang` function:<br>
used to check if a language is valid

## Example

```js
const lang = '';
if (translate.isValidLang(lang)) {
    // now typescript knows that lang can only be an element of the schema array
}
```

this function accept one paramether, the language and it checks if the translation in that language was provided, it returns a boolean

---

`useLang` function:<br>
a shortcut that returns a function to not specify the language every time

## Example

```js
const lang = '';
const t = translate.useLang(lang);
const key = '';
console.log(t(key));
```

this function accept one paramether, the language you want to translate into, and it returns a function that allows you to not specify the language everytime but only the key

---

it has also a `setLang` function attached which allows you to change the language without creating another function

## Example

```js
let lang = '';
const t = translate.useLang(lang);
lang = 'en';
console.log(t.setLang(lang));
```
