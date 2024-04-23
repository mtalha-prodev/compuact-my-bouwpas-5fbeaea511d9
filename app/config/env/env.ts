import {
  APP_ENV_MODE,
  STAGING_CLIENT_SECRET,
  PRODUCTION_CLIENT_SECRET,
  STAGING_CLIENT_ID,
  PRODUCTION_CLIENT_ID,
  GOOGLE_MAPS_TOKEN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  SENTRY_DSN,
} from '@env';
import dayjs from 'dayjs';
import Constants from 'expo-constants';

const now = dayjs();


// IIFE function
const modeVariables = (() => {
  switch (APP_ENV_MODE) {
    case 'TEST':
      return {
        baseApiUrl: 'https://acceptatie.api.bouwpas.nl/v2/',
        clientSecret: STAGING_CLIENT_SECRET,
        clientId: STAGING_CLIENT_ID,
        idProvider: 'acceptatie.id',
        logoutRedirect: 'exp',
        sentryOrganization: SENTRY_ORG,
        sentryProject: SENTRY_PROJECT,
        sentryDsn: SENTRY_DSN,
        sentryToken: SENTRY_AUTH_TOKEN,
        sentryDebug: true,
      };
    case 'STAGING':
      return {
        baseApiUrl: 'https://acceptatie.api.bouwpas.nl/v2/',
        clientSecret: STAGING_CLIENT_SECRET,
        clientId: STAGING_CLIENT_ID,
        idProvider: 'acceptatie.id',
        logoutRedirect: 'bouwpas',
        sentryOrganization: SENTRY_ORG,
        sentryProject: SENTRY_PROJECT,
        sentryDsn: SENTRY_DSN,
        sentryToken: SENTRY_AUTH_TOKEN,
        sentryDebug: true,
      };
    case 'PROD':
      return {
        baseApiUrl: 'https://api.bouwpas.nl/v2/',
        clientSecret: PRODUCTION_CLIENT_SECRET,
        clientId: PRODUCTION_CLIENT_ID,
        idProvider: 'id',
        logoutRedirect: 'bouwpas',
        sentryOrganization: SENTRY_ORG,
        sentryProject: SENTRY_PROJECT,
        sentryDsn: SENTRY_DSN,
        sentryToken: SENTRY_AUTH_TOKEN,
        sentryDebug: false,
      };
  }
})();

export const env = {
  BASE_API_URL: modeVariables.baseApiUrl,
  CLIENT_SECRET: modeVariables.clientSecret,
  CLIENT_ID: modeVariables.clientId,
  APP_REDIRECT: `${modeVariables.logoutRedirect}://--/`,
  TOKEN_URL: `https://${modeVariables.idProvider}.bouwpas.nl/token`,
  BOOKLETS_ALL_URL: 'https://booklets.bouwpas.nl/category_booklets/',
  BOOKLETS_URL: 'https://booklets.bouwpas.nl/booklets/',
  APP_VERSION_CHECK: 'https://api.bouwpas.nl/bundles/version.json',
  AUTHORIZE_KEY_URL: `https://${modeVariables.idProvider}.bouwpas.nl/authorize?grant_type=authorization_code&t=${now}&v=${Constants.expoConfig?.version}&client_id=${modeVariables.clientId}&client_secret=${modeVariables.clientSecret}&response_type=code&redirect_uri=`,
  ACCOUNT_TYPES: `${modeVariables.baseApiUrl}my/account_types`,
  QR_JWT_REGISTRATION: `https://${modeVariables.idProvider}.bouwpas.nl/qr-login`,
  QR_UUID_REGISTRATION: `https://${modeVariables.idProvider}.bouwpas.nl/uuid-login`,
  IMG_URL: 'https://portal.bouwpas.nl/_img/',
  WHOAMI_URL: `${modeVariables.baseApiUrl}workers/whoami`,
  BOUWPAS_PRIVACY_URL: 'https://www.bouwpas.nl/privacybeleid/',
  // --------------------------------------------------------------------------------
  // SENTRY DEBUGGING
  SENTRY_ORG: `${modeVariables.sentryOrganization}`,
  SENTRY_PROJECT: `${modeVariables.sentryProject}`,
  SENTRY_DSN: `${modeVariables.sentryDsn}`,
  SENTRY_TOKEN: `${modeVariables.sentryToken}`,
  SENTRY_DEBUG: `${modeVariables.sentryDebug}`,
  // --------------------------------------------------------------------------------
  // WORKER ENDPOINTS
  WORKER_PROJECTS_URL: `${modeVariables.baseApiUrl}my/projects`,
  LITE_PROJECTS_URL: `${modeVariables.baseApiUrl}my/lite-projects`,
  WORKER_COMPANY_PROJECTS_URL: `${modeVariables.baseApiUrl}my/company-projects`,
  VIRTUAL_BADGES_URL: `${modeVariables.baseApiUrl}my/badges`,
  LAST_ATTENDANCE_LOG_URL: `${modeVariables.baseApiUrl}my/last-attendance`,
  ATTENDANCE_LOG_URL: `${modeVariables.baseApiUrl}my/log-attendance`,
  MY_TOOLBOX_MEETINGS: `${modeVariables.baseApiUrl}my/toolbox-meetings`,
  TOOLBOX_MEETING_ATTENDANCE: `${modeVariables.baseApiUrl}my/toolbox-meetings/attend`,
  // --------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------
  //GATEKEEPER ENDPOINTS
  GATEKEEPER_PROJECTS: `${modeVariables.baseApiUrl}account/projects`,
  GATEKEEPER_TOOLBOXES: `${modeVariables.baseApiUrl}account/toolboxes`,
  UUIDS: `${modeVariables.baseApiUrl}uuids`,
  REGISTRATIONS: `${modeVariables.baseApiUrl}account/registrations`,
  TOOLBOX_MEETINGS_ATTENDEES: `${modeVariables.baseApiUrl}account/get-all-attendees`,
  ONSITE_ATTENDANCE: `${modeVariables.baseApiUrl}account/currently-onsite`,
  ONSITE_WARNINGS: `${modeVariables.baseApiUrl}account/warnings`,
  ONSITE_WORKERS: `${modeVariables.baseApiUrl}account/workers-onsite`,
  ONSITE_LOG_ATTENDANCE: `${modeVariables.baseApiUrl}account/log-attendance`,
  ONSITE_PROJECT_CONFIG: `${modeVariables.baseApiUrl}project-with-config`,
  //---------------------------------------------------------------------------------
  TOKEN_URL_ENC: `https://${modeVariables.idProvider}.bouwpas.nl/token_enc`,
  LOGOUT: `https://${modeVariables.idProvider}.bouwpas.nl/logout?redirect_to_app=${modeVariables.logoutRedirect}`,
  GOOGLE_MAPS_TOKEN,
  MBA_CREATE_ACCOUNT: 'https://help.bouwpas.nl/hc/articles/360019793600',
  MBA_HELP_URL: 'https://help.bouwpas.nl/hc/sections/360003637500',
  MBA_HELP_SCAN_ATTENDANCE: 'https://help.bouwpas.nl/hc/articles/4402400411154',
  MBA_HELP_SCAN_TOOLBOX_ATTENDANCE: 'https://help.bouwpas.nl/hc/articles/4402395368338',
  MBA_HELP_SCAN_UUID: 'https://help.bouwpas.nl/hc/articles/4605275397010',
  MBA_HELP_GATEKEEPER_SWIPE: 'https://help.bouwpas.nl/hc/articles/17943749539090',
  //---------------------------------------------------------------------------------
  SAFESIGHT_PLAY_MARKET_LINK:
    'https://play.google.com/store/apps/details?id=com.ionicframework.myapp817379&gl=NL',
  SAFESIGHT_IOS_MARKET_LINK: 'itms-apps://itunes.apple.com/app/1015115741',

  //Main categories for booklets based on categoryId from booklets-backend
  ALGEMEEN: 1,
  VEILIGHEID: 2,
  KWALITEIT: 3,
  MILIEU: 4,
  PROJECTEN: 5,
  BOUWPAS_MANUAL: 2,
  ROLE_BOUWPLAATS: 'ROLE_BOUWPLAATS',
  ROLE_OPDRACHT_GEVER: 'ROLE_OPDRACHTGEVER',
};
