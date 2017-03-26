<p align="center" style="text-align: center;">
<a href="http://lasserafn.github.io/phalange/"><img src="https://cdn.rawgit.com/LasseRafn/Phalange/1976e25f/logo.svg" width="346" height="52" alt="Phalange Logo" /></a>
</p>

<p align="center" style="text-align: center;">
<a href="https://codecov.io/gh/LasseRafn/Phalange"><img src="https://img.shields.io/codecov/c/github/LasseRafn/Phalange.svg?style=flat-square" /></a>
<a href="https://travis-ci.org/LasseRafn/Phalange"><img src="https://img.shields.io/travis/LasseRafn/Phalange.svg?style=flat-square" /></a>
<a href="http://npmjs.com/package/phalange"><img src="https://img.shields.io/npm/v/phalange.svg?style=flat-square" /></a>
<a href="http://npmjs.com/package/phalange"><img src="https://img.shields.io/npm/dt/phalange.svg?style=flat-square" /></a>
</p>

# Phalange

Phalange is a lightweight (`700 bytes` gzipped) JavaScript form library with error handling and fetch (Polyfilled with [developit/unfetch](https://github.com/developit/unfetch))

It's promise-based, which makes running scripts on error/success very easy.

------------------------------------------------

## Table of Contents

* [Getting Started](#getting-started)
* [Usage](#usage)
* [API](#api)
* [Examples](#examples)
* [FormSpine (Phalange with validation)](#formspine)
* [Inspiration](#inspiration)

------------------------------------------------

## Getting Started

### Install Instructions

Adding Phalange to your project requires NPM. Optinally you could use [Yarn](https://yarnpkg.com).

Run the following command in your project root:
```bash
npm install phalange --save
```

Or with Yarn:
```bash
yarn add phalange
```

### Using In Your Project

Using Rollup or WebPack (or another module bundler), you can do like this: 
```js
// ES6
import Phalange from "phalange";

// CommonJS
var Phalange = require("phalange");
```

#### Remember to polyfill `Fetch`
```js
require("unfetch/polyfill");
```

#### It's also on unpkg:
```html
<script src="//unpkg.com/phalange/dist/phalange.umd.js"></script>

<script>
var Phalange = phalange; // to fix name in UMD package, for consistency.

new Phalange('/', {});
</script>
```
_Please notice that the `fetch` polyfill is **NOT** included in the UMD version._
 
------------------------------------------------

## Usage

### Vue.js example
```js
let fields = {
    todo_text: ""
};

new Vue({
    el: "#app",
    data: {
        form: new Phalange('/create-todo', fields)
    },
    
    methods: {
        submit: function() {
            this.form.post().then(() => alert('Done!'));
        }
    }
});
```

------------------------------------------------

## API

### The `Phalange` Class

The `Phalange` class is the core of Phalange and the class you'll be using.

#### Methods

| Method | Description | Parameters |
| ------ | ----------- | ---------- |
| `post` | Sends a `POST` request to the url specified in the Form object |  |
| `delete` | Sends a `DELETE`/`DESTROY` request to the url specified in the Form object |  |
| `put` | Sends a `PUT` request to the url specified in the Form object |  |
| `submit` | Sends a request with the `type` specified, to the url specified in the Form object | `type`: Any request type possible in the fetch api. Example: `form.submit('GET')` |

#### Parameters

| Name | Type | Description | Required | Default |
| ---- |----- | ----------- |--------- | ------- |
| `url` | string | The url that requests should be send to. | true | `''` |
| `fields` | object | The fields in the form. | true | `{}` |
| `options` | object | An object with additional options | false | `{}` |

##### Phalange `options` parameters

| Name | Type | Description | Required | Default |
| ---- |----- | ----------- |--------- | ------- |
| `resetOnSuccess` | boolean | Determines if form fields should be cleared on success. | false | false |
| `headers` | object | Adds custom headers to each request | false | `{}` |

##### `url`

The `url` parameter is the first of three parameters, and it defines which url to send requests to upon submitting. It can be an absolute or relative url, such as: `/submit` or `https://your-site.com/send`.

##### `fields`

The fields that you have in the form. Should be an object of keys with a value (the default input value)

**Example:**
```js
let fields = {
    username: "",
    password: ""
};

// Init form
let formObject = new Phalange('/login', fields);
```
------------------------------------------------

## Examples

[Vue Demo](http://codepen.io/LasseRafn/pen/RpJMLY/) **TODO**

[Preact Demo](http://codepen.io/LasseRafn/pen/qrKMgG/) **TODO**

[Angular Demo](http://codepen.io/LasseRafn/pen/qrKMgG/) **TODO**

------------------------------------------------

## FormSpine

Want client-side validation? Try **FormSpine**?

It's a larger version of Phalange, with a Validation library. It's almost the same API, but with more functionality.

[Get FormSpine here](https://github.com/LasseRafn/FormSpine)

------------------------------------------------

## Inspiration
Basically I figured that sometimes, client-side validation is not necessary, so to save bytes I decided to make Phalange; a smaller version of FormSpine.

Build scripts (and more) are heavily based on [developit/unfetch](https://github.com/developit/unfetch). 
