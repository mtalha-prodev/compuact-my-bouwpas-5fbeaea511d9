// compareVersion() response examples
// 0: version strings are equal
// 1: version a is greater than b
// -1: version b is greater than a
export const compareVersion = (a: string, b: string) => {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};
