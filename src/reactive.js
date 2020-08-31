import { isObject } from './utils';

const proxyCache = new WeakMap();
const trackMap = new WeakMap();
const effectCache = [];

export function reactive(target) {
  return createReactive(target);
}

function createReactive(target, parent, key) {
  if (!isObject(target)) return target;
  let observed = proxyCache.get(target);
  if (observed) return target;
  Object.keys(target).forEach((key) => {
    defineReactive(target, key, target[key]);
  });
  proxyCache.set(target, true);
  return target;
}

export function defineReactive(target, key, val) {
  createReactive(val, target, key);
  Object.defineProperty(target, key, {
    get: function reactiveGetter() {
      track(target, key);
      return val;
    },
    set: function reactiveSetter(newVal) {
      val = newVal;
      trigger(target, key);
      if (isObject(val)) {
        createReactive(val, target, key);
      }
    },
  });
}

export function effect(fn, options = { lazy: false }) {
  const effect = createEffect(fn);
  // if lazy set to true, it should be called manually at least once outside
  if (!options.lazy) {
    effect();
  }
  effect.computed = options.computed;
  effect.reset = options.reset;
  return effect;
}

function createEffect(fn) {
  const effect = function() {
    return runEffect(effect, fn);
  };
  return effect;
}

function runEffect(effect, fn) {
  try {
    effectCache.push(effect);
    return fn();
  } finally {
    effectCache.pop();
  }
}

function track(target, key) {
  const effect = effectCache[effectCache.length - 1];
  if (effect) {
    let depsMap = trackMap.get(target);
    if (!depsMap) {
      trackMap.set(target, depsMap = new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Set());
    }
    if (!dep.has(effect)) {
      dep.add(effect);
    }
  }
}

function trigger(target, key) {
  const depsMap = trackMap.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  if (effects) {
    effects.forEach(effect => {
      if (effect.computed) {
        effect.reset();
      } else {
        effect();
      }
    });
  }
}

export function computed(getter) {
  let initAttach = false;
  let needCache = true;
  const runner = effect(getter, {
    lazy: true,
    computed: true,
    reset() {
      needCache = true;
    }
  });
  let value = null;
  return {
    _isRef: true,
    oldValue: null,
    get value() {
      const applyNewEffect = effectCache[effectCache.length-1];
      if (!initAttach) {
        runner()
        initAttach = true;
      }
      if (applyNewEffect || needCache) {
        this.oldValue = value;
        value = getter();
        needCache = false;
      }
      return value;
    }
  };
}

export function watch(target, key, effect) {
  if (!target[key]) return;
  effectCache.push(effect);
  if (target[key]._isRef) {
    // trigger watch for all computed's deps
    target[key].value;
  } else {
    track(target, key);
  }
  effectCache.pop();
}

