# Reactive

Tiny reactive data handler for javascript based on Vuejs.

Currently not handle with array issue, such as `push`, `pop`...etc.

> Warn: logic in this plugin may not be exact how Vuejs does.


## Install

Use npm or yarn to install

``` bash
$ npm install reactive
$ yarn add reactive
```

Use browser script include, will be set as `window.Reactive`.

``` html
<script src="./dist/reactive.min.js"></script>
```


## Usage

### Quick Use:

```js
import Reactive from 'reactive';

const reactive = new Reactive({
  data: {
    name: 'Johnny',
    age: 30,
  },
  watch: {
    name() {
      console.log('name changed!');
    },
  },
});

reactive.name = 'Kevin';
// name changed!
```


### Options detail

#### data

  - type: `Object`
  - create a reactive object with getter/setter
  - access by `reactive` of its `$data` property.


#### computed

  - type: `Object`
  - collection of computed property that will be set to data
  - now only support getter

> **DEMO**: watch for computed property:

```js
const reactive = new Reactive({
  data: {
    name: 'Johnny',
    age: 30,
  },
  computed: {
    info() {
      return this.name + ' ' + this.age;
    },
  },
  watch: {
    info() {
      console.log('info changed!');
    },
  },
});

reactive.name = 'Kevin';
// info changed
```

or create `computed` property to `reactive` object by functional calling.

 - $computed(key, getter);

  * key: `String`
  * getter: `Function`

```js
// here must not be an arrow function, wouldnt get correct this
reactive.computed('info', function() {
  return this.name + ' ' + this.age;
});
```


### watch

watch a property when it is changed. can watch both computed or data,

but could only watch first level, if need for watch nested object.

use the functional version `$watch` by `reactive` object.

 - $watch(target, key, effect);

  * target: `String` or `reactive` object
  * key: `String`
  * effect: `Function`

```javascript
const reactive = new Reactive({
  data: {
    info: {
      name: 'Johnny',
      age: 30,
    },
    a: {
      b: {
        c: {
          d: 'd'
        }
      }
    }
  },
};

// nested structure from $data
reactive.$watch('a.b.c', 'd', () => /* ... */);

reactive.$watch('info', 'name', () => /* ... */);
// same as(if not string, should be a reactive data object)
reactive.$watch(reactive.$data.info, 'name', () => /* ... */);
```


### lifeCycle

Only two hooks here as `beforeCreate` & `created`

```js
const reactive = new Reactive({
  watch: {
    height() {
      console.log('height changed');
    }
  },
  beforeCreate() {
    // you can changed any options by this.$options
    // before creating the reactive object
    this.$options.data.height = 3000;
  },
  created() {
    // you can use any data inside reactive by this
    this.height = 1000;
  },
})
```


### set

if need to add new reactive property, use `$set` to add it into `$data`,
it'll auto proxy it into `reactive` object too.

> be awared that you can not use a property inside computed if it's not yet created, it'll show `undefined`.

- $set(key, value);

  * key: `String`
  * value: `any`

```js
reactive.$set('name', 'Kevin');
```
