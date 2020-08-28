# Reactive

Tiny reactive data handler for javascript based on Vuejs.

Currently not handle with array issue, such as `push`, `pop`...etc.


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

```javascript
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

> **DEMO**: watch for computed property:

```javascript
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

