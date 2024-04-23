import * as Linking from 'expo-linking';

import {
  AuthNavigatorName,
  AuthScreens,
  GlobalRoutes,
  MissingScreens,
  SignedInNavigatorNames,
  SignedInUser,
} from './route-names';

export const linkingConfiguration = {
  prefixes: [Linking.createURL('--/')],
  config: {
    screens: {
      [AuthNavigatorName.MAIN_STACK_GROUP]: {
        screens: {
          [GlobalRoutes.APP_VERSION_LOADING]: GlobalRoutes.APP_VERSION_LOADING,
          [GlobalRoutes.APP_UPDATE]: GlobalRoutes.APP_UPDATE,
          [GlobalRoutes.APP_WIZARD]: GlobalRoutes.APP_WIZARD,
          [SignedInNavigatorNames.SIGNED_IN_NAVIGATOR]: {
            screens: {},
          },
          [AuthNavigatorName.AUTH_NAVIGATOR]: {
            screens: {
              [AuthNavigatorName.AUTH_DRAWER_NAVIGATOR]: {
                screens: {
                  [AuthNavigatorName.AUTH_TABS_NAVIGATOR]: {
                    screens: {
                      [AuthScreens.SIGN_IN]: AuthScreens.SIGN_IN,
                      [AuthScreens.PUBLIC_BOOKLETS]: AuthScreens.PUBLIC_BOOKLETS,
                    },
                  },
                },
              },
              [GlobalRoutes.APP_SETTINGS]: GlobalRoutes.APP_SETTINGS,
            },
          },
          [SignedInNavigatorNames.SIGNED_IN_NAVIGATOR]: {
            screens: {
              [SignedInNavigatorNames.WORKER_DRAWER_NAVIGATOR]: {
                screens: {
                  [SignedInNavigatorNames.WORKER_STACK_NAVIGATOR]: {
                    screens: {
                      [SignedInNavigatorNames.WORKER_TABS_NAVIGATOR]: {
                        screens: {
                          [SignedInUser.WORKER_PROJECTS]: SignedInUser.WORKER_PROJECTS,
                          [SignedInUser.WORKER_BOOKLETS]: SignedInUser.WORKER_BOOKLETS,
                          [SignedInUser.WORKER_TOOLBOXES]: SignedInUser.WORKER_TOOLBOXES,
                        },
                      },
                      [SignedInUser.WORKER_OTHER_PROJECTS]: SignedInUser.WORKER_OTHER_PROJECTS,
                      [SignedInUser.WORKER_PROJECT_ITEM]: {
                        path: `${SignedInUser.WORKER_PROJECT_ITEM}/:projectId`,
                        parse: {
                          projectId: (projectId: string) => `${projectId}`,
                        },
                      },
                    },
                  },
                },
              },
              [SignedInNavigatorNames.GATEKEEPER_DRAWER_NAVIGATOR]: {
                screens: {},
              },
              [SignedInNavigatorNames.COMPANYUSER_DRAWER_NAVIGATOR]: {
                screens: {},
              },
            },
          },
          [GlobalRoutes.BOOKLET_ITEM]: {
            path: `${GlobalRoutes.BOOKLET_ITEM}/:bookletId`,
            parse: {
              bookletId: (bookletId: string) => `${bookletId}`,
            },
          },
        },
      },
      [MissingScreens.GLOBAL]: MissingScreens.GLOBAL,
    },
  },
};
