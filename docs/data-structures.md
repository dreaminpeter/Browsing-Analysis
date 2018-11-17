# Data Structures

## Array

A list holds a "list" of things. The type of the items depend on the language you're using, but JavaScript doesn't require one specific type, allowing you to have mixed types.

In JavaScript this data structure is called [Array](https://developer.mozilla.org/en-US/docs/Glossary/array).

```js
const numbers = [1, 2, 3, 4];
const letters = ["a", "b", "c"];
const mixed = [1, "a", new Object()];
```

JavaScript has zeroed-indexed arrays.

```js
const words = ["hello", "sun", "people"];
words.length; //=> 3

words[0]; //=> "hello"
words[1]; //=> "sun"
words[2]; //=> "people"
words[3]; //=> undefined
```

## Dictionary (Objects really)

https://en.wikibooks.org/wiki/A-level_Computing/AQA/Paper_1/Fundamentals_of_data_structures/Dictionaries

```js
const person = {
  eye_color: "blue",
  height: 180,
  weight: 75
};
```

```js
const visits = {
  "www.amazon.com": [1542412877347],

  "www.spotify.com": [],

  "bestbuy.ca": []
};
```
