import AsyncStorage from '@react-native-async-storage/async-storage';
import { State, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

export const withPersist = <T extends State>(
  { persist_key }: { persist_key: string },
  config: StateCreator<T>,
) =>
  persist(config, {
    name: persist_key,
    getStorage: () => AsyncStorage,
    //@ts-ignore
    partialize: state =>
      //@ts-ignore
      Object.fromEntries(
        Object.entries(state).filter(
          ([key]) =>
            ![
              'bootstrapState',
              'currentRoute',
              'lastAppBgTimestamp',
              'safesightContractors',
              'currentAttendanceType',
            ].includes(key),
        ),
      ),
  });
