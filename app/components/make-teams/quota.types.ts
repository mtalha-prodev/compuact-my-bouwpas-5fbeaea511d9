export type TQuotaKeyColors = '0' | '25' | '50' | '75' | '100';

export interface IQuota {
    backgroundColorData: TQuotaKeyColors,
    percentage: string;
}
