import createGetter from './createGetter'

export default function getter(...dependencies) {
  return function (target, key, descriptor) {
    descriptor.value = createGetter(dependencies, descriptor.value);
    return descriptor;
  }
}