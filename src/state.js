import { isObject, callHook, bind } from './utils';
import { reactive } from './reactive';

export function initState(vm) {
  initMethods(vm);
  callHook(vm, 'beforeCreated');
  initData(vm);
  initProxy(vm);
  initComputed(vm);
  initWatcher(vm);
  callHook(vm, 'created');
}

function initData(vm) {
  vm.$data = reactive(vm.$options.data);
}

function initComputed(vm) {
  const { computed: _computed } = vm.$options;
  if (isObject(_computed)) {
    for (const key in _computed) {
      vm.$computed(key, _computed[key]);
    }
  }
}

function initMethods(vm) {
  const methods = vm.$options.methods;
  if (isObject(methods)) {
    for (const key in methods) {
      vm[key] = bind(methods[key], vm);
    }
  }
}

function initWatcher(vm) {
  const { watch: _watch } = vm.$options;
  if (isObject(_watch)) {
    for (const key in _watch) {
      vm.$watch(vm.$data, key, _watch[key].bind(vm.$data));
    }
  }
}

function initProxy(vm) {
  const data = vm.$data;
  for (const key in data) {
    vm.$proxy(vm, data, key);
  }
}
