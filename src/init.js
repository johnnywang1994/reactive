import { initState } from './state';
import { defineReactive, watch, computed } from './reactive';
import { getVMVal } from './utils';

export function initGlobal(Reactive) {
  Reactive.prototype._init = function(options) {
    const vm = this;
    vm.$options = options;
    initState(vm);
  };

  Reactive.prototype.$proxy = defineProxy;

  Reactive.prototype.$set = function setReactive(key, value) {
    const vm = this;
    vm.$proxy(vm, vm.$data, key);
    return defineReactive(vm.$data, key, value);
  };

  Reactive.prototype.$watch = function watchReactive(target, key, effect) {
    // string direct to this object
    if (typeof target === 'string') {
      return watch(getVMVal(this.$data, target), key, effect);
    }
    // raw watch
    return watch(target, key, effect);
  };

  Reactive.prototype.$computed = function createComputed(key, getter) {
    const vm = this;
    vm.$proxy(vm, vm.$data, key);
    return defineComputed(vm.$data, key, getter);
  };
}

/**
 * defineComputed
 * define computed property for specify target object
 * @param {Object} target 
 * @param {String} key 
 * @param {Function} getter 
 */
function defineComputed(target, key, getter) {
  const newComputed = computed(getter.bind(target));
  Object.defineProperty(target, key, {
    enumerable: true,
    get: () => newComputed.value,
  });
  return newComputed.value;
}

/**
 * defineProxy
 * define specify target property getter for another object
 * @param {Object} target 
 * @param {Object} data 
 * @param {String} key 
 */
function defineProxy(target, data, key) {
  Object.defineProperty(target, key, {
    get: () => data[key],
    set: (newVal) => data[key] = newVal,
  });
}
