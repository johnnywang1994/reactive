export function isObject(v) {
  return v !== null && typeof v === 'object';
}

export function isFn(v) {
  return typeof v === 'function';
}

export function bind(fn, ctx) {
  function boundFn (a) {
    const l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx);
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn;
}

export function getVMVal(target, exp) {
  let val = target;
  exp = exp.split('.');
  exp.forEach((k) => {
    let re = /\[(\d+)\]/gi;
    if (re.test(k)) {
      let _k = k.split('[')[0];
      let _i = k.split('[')[1].replace(']', '');
      val = val[_k][_i];
    } else {
      val = val[k];
    }
  });
  return val;
}

export function callHook(vm, hookName) {
  const hook = vm.$options[hookName];
  if (hook && isFn(hook)) {
    hook.call(vm);
  }
}
