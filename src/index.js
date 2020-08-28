import { initGlobal } from './init';

function Reactive(options) {
  Object.defineProperty(this, '__reactive__', {
    enumerable: false,
    get: () => true,
  });
  this._init(options);
}

initGlobal(Reactive);

export default Reactive;