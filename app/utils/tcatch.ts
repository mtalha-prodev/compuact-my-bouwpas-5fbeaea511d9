export const tcatch = async <DataType = unknown, ErrorType = unknown>(
  promise: Promise<any>,
): Promise<[DataType | null, ErrorType | null]> => {
  try {
    const tcData = await promise;
    return [tcData as DataType, null];
  } catch (tcError) {
    return [null, tcError as ErrorType];
  }
};
