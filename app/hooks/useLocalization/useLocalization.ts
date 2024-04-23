import { TxKeyPath } from 'app/i18n';
import * as Localization from 'expo-localization';
import I18n from 'i18n-js';
import React from 'react';

export const useLocalization = () => {
  const [locale, setLocale] = React.useState(Localization.locale);

  const localization = React.useMemo(
    () => ({
      t: (key: TxKeyPath, options?: I18n.TranslateOptions) => I18n.t(key, { locale, options }),
      locale,
      setLocale,
    }),
    [locale],
  );

  return localization;
};
