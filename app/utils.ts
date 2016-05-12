export function replaceEntry<T>(map: { [key: string]: T }, key: string, value: T): {[key: string]: T} {
  return Object.assign({}, map, {[key]: value });
}

export function swap<T>(o: T, change: (o: T) => void) {
  const clone = Object.assign({}, o) as T;
  change(clone);
  return clone;
}
