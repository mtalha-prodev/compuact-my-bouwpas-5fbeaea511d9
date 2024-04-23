import * as Localization from 'expo-localization';
import I18n from 'i18n-js';
import React from 'react';

import { TxKeyPath } from '../i18n';

export type LocalizationContextTypes = {
  t: (key: TxKeyPath, options?: I18n.TranslateOptions) => string;
  locale: string;
  setLocale: React.Dispatch<React.SetStateAction<string>>;
};

export const LocalizationContext = React.createContext<LocalizationContextTypes>({
  t: (key: TxKeyPath) => key,
  locale: Localization.locale,
  setLocale: () => {},
});
