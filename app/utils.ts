export function replaceEntry<T>(map: { [key: string]: T }, key: string, value: T): {[key: string]: T} {
  return Object.assign({}, map, {[key]: value });
}
