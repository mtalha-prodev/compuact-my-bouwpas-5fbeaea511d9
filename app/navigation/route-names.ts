// Navigator names
export enum AuthNavigatorName {
  MAIN_STACK_GROUP = 'main-stack-group',
  AUTH_NAVIGATOR = 'auth-navigator',
  AUTH_DRAWER_NAVIGATOR = 'auth-drawer-navigator',
  AUTH_TABS_NAVIGATOR = 'auth-tab-navigator',
}

export enum SignedInNavigatorNames {
  SIGNED_IN_NAVIGATOR = 'signed-in-navigator',
  // Worker
  WORKER_STACK_NAVIGATOR = 'worker-stack-navigator',
  WORKER_TABS_NAVIGATOR = 'worker-tabs-navigator',
  WORKER_DRAWER_NAVIGATOR = 'worker-drawer-navigator',
  // Gatekeeper
  GATEKEEPER_STACK_NAVIGATOR = 'gatekeeper-stack-navigator',
  GATEKEEPER_TABS_NAVIGATOR = 'gatekeeper-tabs-navigator',
  GATEKEEPER_DRAWER_NAVIGATOR = 'gatekeeper-drawer-navigator',
  // CompanyUser
  COMPANYUSER_DRAWER_NAVIGATOR = 'companyuser-drawer-navigator',
}

//Screen names
export enum AuthScreens {
  SIGN_IN = 'login',
  PUBLIC_BOOKLETS = 'booklets',
  PUBLIC_BOOKLETS_ITEM = 'booklets-item',
}

export enum SignedInUser {
  // Worker
  WORKER_PROJECTS = 'worker-projects',
  WORKER_LITE_PROJECTS = 'worker-lite-projects',
  WORKER_OTHER_PROJECTS = 'worker-other-projects',
  WORKER_PROJECT_ITEM = 'worker-project-item',
  LITE_PROJECT_ITEM = 'lite-project-item',
  WORKER_BOOKLETS = 'worker-booklets',
  WORKER_INFO = 'worker-info',
  WORKER_EMPLOYERS = 'worker-employers',
  WORKER_TOOLBOXES = 'worker-toolboxes',
  WORKER_TOOLBOX_ITEM = 'worker-toolbox-item',
  WORKER_QR_UUID = 'worker-qr-uuid',
  // Gatekeeper
  GATEKEEPER_PROJECTS = 'gatekeeper-projects',
  GATEKEEPER_PROJECT_ITEM = 'gatekeeper-project-item',
  GATEKEEPER_BOOKLETS = 'gatekeeper-booklets',
  GATEKEEPER_TOOLBOXES = 'gatekeeper-toolboxes',
  GATEKEEPER_QR_WORKER_INFO = 'gatekeeper-qr-worker-info',
  GATEKEEPER_MAKE_TEAMS_INFO = 'gatekeeper-make_teams_info',
  GATEKEEPER_TOOLBOX_MEETING_ITEM = 'gatekeeper-toolbox-meeting-item',
  GATEKEEPER_HOST_TOOLBOX_MEETING = 'gatekeeper-host-toolbox-meeting',
  GATEKEEPER_ONSITE_WARNING_ITEM = 'gatekeeper-onsite-warning-item',
  GATEKEEPER_ONSITE_WARNINGS_LIST = 'gatekeeper-onsite-warning-list',
  GATEKEEPER_ONSITE_CREATE_WARNING = 'gatekeeper-onsite-create-warning',
  GATEKEEPER_ONSITE_WORKERS = 'gatekeeper-onsite-workers-list',
  GATEKEEPER_ONSITE_READ_NOTES = 'gatekeeper-onsite-read-notes',
}

export enum MissingScreens {
  GLOBAL = '*',
}

export enum GlobalRoutes {
  APP_VERSION_LOADING = 'app-version-loading',
  APP_UPDATE = 'app-update',
  APP_WIZARD = 'app-wizard',
  QR_SCANNER = 'qr-scanner',
  APP_SETTINGS = 'settings',
  APP_PRIVACY = 'PRIVACY',
  BOOKLET_ITEM = 'booklet-item',
  NO_USER_ACCESS = 'no-user-access',
}
