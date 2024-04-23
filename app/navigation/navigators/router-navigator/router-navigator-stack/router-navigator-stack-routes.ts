import { BookletItem } from 'app/layouts/booklets/booklet-item';
import { navigatorOptions } from 'app/navigation/navigation-options';
import { GlobalRoutes, SignedInUser } from 'app/navigation/route-names';
import { TScreenRoutes } from 'app/navigation/types/navigation-types';
import { QrScanner, QrUuid } from 'app/screens';

export const routerNavigatorStackRoutes: TScreenRoutes = [
  {
    routeName: GlobalRoutes.QR_SCANNER,
    component: QrScanner,
    options: {
      headerShown: false,
      presentation: 'modal',
      animation: 'slide_from_bottom',
    },
  },
  {
    routeName: SignedInUser.WORKER_QR_UUID,
    component: QrUuid,
    options: {
      headerShown: false,
      presentation: 'modal',
      animation: 'slide_from_bottom',
    },
  },
  {
    routeName: GlobalRoutes.BOOKLET_ITEM,
    component: BookletItem,
    options: navigatorOptions,
  },
];
