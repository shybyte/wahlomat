export function replaceEntry<T>(map: { [key: string]: T }, key: string, value: T): { [key: string]: T } {
  return Object.assign({}, map, { [key]: value });
}

export function swap<T>(o: T, change: (o: T) => void) {
  const clone = Object.assign({}, o) as T;
  change(clone);
  return clone;
}

export function assign<T extends P, P>(o: T, newProps: P) {
  return Object.assign({}, o, newProps) as T;
}

export function extend<T, P>(o1: T, o2: P): T & P {
  return Object.assign({}, o1, o2) as T & P;
}

export function loadObjectFromLocalStorage<T extends {}>(key: string, defaultValue: T): T {
  const valueString = localStorage.getItem(key);
  if (valueString) {
    return assign(defaultValue, JSON.parse(valueString));
  } else {
    return defaultValue;
  }
}


