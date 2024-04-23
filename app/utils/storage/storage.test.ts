import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  loadAsyncParsed,
  loadAsyncString,
  saveAsyncStringify,
  saveAsyncString,
  clearAsyncStorage,
  removeAsyncItem,
} from './storage';

// fixtures
const VALUE_OBJECT = { x: 1 };
const VALUE_STRING = JSON.stringify(VALUE_OBJECT);

beforeEach(() =>
  (AsyncStorage.getItem as jest.Mock).mockReturnValue(Promise.resolve(VALUE_STRING)),
);
afterEach(() => jest.clearAllMocks());

test('loadAsyncParsed', async () => {
  const value = await loadAsyncParsed('something');
  expect(value).toEqual(JSON.parse(VALUE_STRING));
});

test('loadAsyncString', async () => {
  const value = await loadAsyncString('something');
  expect(value).toEqual(VALUE_STRING);
});

test('saveAsyncStringify', async () => {
  await saveAsyncStringify('something', VALUE_OBJECT);
  expect(AsyncStorage.setItem).toHaveBeenCalledWith('something', VALUE_STRING);
});

test('saveAsyncString', async () => {
  await saveAsyncString('something', VALUE_STRING);
  expect(AsyncStorage.setItem).toHaveBeenCalledWith('something', VALUE_STRING);
});

test('removeAsyncItem', async () => {
  await removeAsyncItem('something');
  expect(AsyncStorage.removeItem).toHaveBeenCalledWith('something');
});

test('clearAsyncStorage', async () => {
  await clearAsyncStorage();
  expect(AsyncStorage.clear).toHaveBeenCalledWith();
});
