export default function(dependencies, fn) {
  fn.paramNames = dependencies;
  return fn;
}