import { useStore } from 'app/store/main-store/main-store';
import { UserStateSlaceTypes } from 'app/store/main-store/slices/user-slice';
import React from 'react';
import { Image } from 'react-native';

import { DropdownList, IDropdownListItem } from '../dropdown';

export const AppLanguagePicker: React.FC = () => {
  const language = useStore.useLanguage();

  const languagesList = [
    {
      label: 'EN',
      value: 'en',
      leftElement: (
        <Image
          source={require('app/assets/images/flags/EN.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
    },
    {
      label: 'NL',
      value: 'nl',
      leftElement: (
        <Image
          source={require('app/assets/images/flags/NL.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
    },
    {
      label: 'DE',
      value: 'de',
      leftElement: (
        <Image
          source={require('app/assets/images/flags/DE.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
    },
    {
      label: 'PL',
      value: 'pl',
      leftElement: (
        <Image
          source={require('app/assets/images/flags/PL.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
    },
    {
      label: 'RO',
      value: 'ro',
      leftElement: (
        <Image
          source={require('app/assets/images/flags/RO.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
    },
    {
      label: 'TR',
      value: 'tr',
      leftElement: (
        <Image
          source={require('app/assets/images/flags/TR.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
    },
  ];

  const onLanguageChange = (item: IDropdownListItem) => {
    const language = item.value as UserStateSlaceTypes['language'];
    useStore.setState({ language });
  };

  return (
    <DropdownList
      placeholder={language ? language.toUpperCase() : 'Select language'}
      list={{
        items: languagesList,
      }}
      dropdownHeight={200}
      onSelectItem={onLanguageChange}
    />
  );
};
