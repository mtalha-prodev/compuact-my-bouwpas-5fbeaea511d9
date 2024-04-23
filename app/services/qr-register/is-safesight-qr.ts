export function isSafesightQr(content: string): boolean {
  const regexp = new RegExp(
    '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{25}$',
  );

  return regexp.test(content);
}
