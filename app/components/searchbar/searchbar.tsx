import { LocalizationContext } from 'app/contexts';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import DelayInput from 'react-native-debounce-input';

const styles = StyleSheet.create({
  searchBar: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    borderColor: 'lightgray',
    borderWidth: 2,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarInput: {
    width: '100%',
    paddingHorizontal: '5%',
    fontSize: 16,
  },
});

interface SearchBarBodyProps {
  inputRef: any;
  searchFilter?: string;
  onChange: any;
}

export const SearchBar: FC<SearchBarBodyProps> = ({ inputRef, searchFilter, onChange }) => {
  const { t } = React.useContext(LocalizationContext);

  return (
    <View style={styles.searchBar}>
      <DelayInput
        autoCorrect={false}
        returnKeyType="done"
        placeholder={t('search') + '...'}
        placeholderTextColor="gray"
        value={searchFilter}
        minLength={3}
        inputRef={inputRef}
        onChangeText={onChange}
        delayTimeout={150}
        style={styles.searchBarInput}
      />
    </View>
  );
};
