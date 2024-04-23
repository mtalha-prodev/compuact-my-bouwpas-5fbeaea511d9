export type TUser = {
  user: {
    accountId: number;
    type: 'workeruser' | 'accountuser' | 'companyuser';
    username: string;
    roles: any[] | undefined;
  }[];
} | null;
