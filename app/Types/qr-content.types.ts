export type TQrContent = {
  hostname: string;
  path: string;
  queryParams: {
    jwt?: string;
  };
  scheme: string;
};

export type TQrData =
  | {
      qrData: {
        content: any;
        rawScannedData?: any;
      };
    }
  | undefined;
