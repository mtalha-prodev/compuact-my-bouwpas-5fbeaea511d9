import { State, UseBoundStore } from 'zustand';

interface Selector<StoreType> {
  use: {
    [key in keyof StoreType]: () => StoreType[key];
  };
}

type Hook<BaseType> = {
  [Key in keyof BaseType as `use${Capitalize<string & Key>}`]: () => BaseType[Key];
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function createSelectorFunctions<StoreType extends State>(store: UseBoundStore<StoreType>) {
  (store as any).use = {};

  Object.keys(store.getState()).forEach(key => {
    const selector = (state: StoreType) => state[key as keyof StoreType];
    (store as any).use[key] = () => store(selector);
  });

  return store as UseBoundStore<StoreType> & Selector<StoreType>;
}

export function createSelectorHooks<StoreType extends State>(store: UseBoundStore<StoreType>) {
  (store as any).use = {};

  Object.keys(store.getState()).forEach(key => {
    const selector = (state: StoreType) => state[key as keyof StoreType];
    // @ts-ignore
    store[`use${capitalize(key)}`] = () => store(selector);
  });

  return store as UseBoundStore<StoreType> & Hook<StoreType>;
}
