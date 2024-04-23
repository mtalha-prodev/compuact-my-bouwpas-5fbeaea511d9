declare module '@env' {
  export const API_URL: string;
  export const APP_ENV_MODE: 'TEST' | 'STAGING' | 'PROD';
  export const STAGING_CLIENT_SECRET: string;
  export const STAGING_CLIENT_ID: string;
  export const PRODUCTION_CLIENT_ID: string;
  export const PRODUCTION_CLIENT_SECRET: string;
  export const FONTAWESOME_TOKEN: string;
  export const GOOGLE_MAPS_TOKEN: string;
  export const SENTRY_ORG: string;
  export const SENTRY_PROJECT: string;
  export const SENTRY_AUTH_TOKEN: string;
  export const SENTRY_DSN: string;
}
