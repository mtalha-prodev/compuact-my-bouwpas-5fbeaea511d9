import { IStore } from '../main-store/main-store';

type StoreTypes = (update: IStore | ((prev: IStore) => IStore)) => void;
type StateKeys = keyof IStore;

export const mutateNestedAtomState = (
  setState: StoreTypes,
  stateName: StateKeys,
  newValue: any,
) => {
  setState(prevValue => ({
    ...prevValue,
    [stateName]: {
      ...(prevValue[stateName] as object),
      ...newValue,
    },
  }));
};

export const mutateAtomState = (setState: StoreTypes, newValue: Partial<IStore>) => {
  setState(prevValue => ({
    ...prevValue,
    ...newValue,
  }));
};
