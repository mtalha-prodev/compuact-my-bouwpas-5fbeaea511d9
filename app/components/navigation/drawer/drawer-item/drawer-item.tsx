import { FontAwesomeIcon } from 'app/components/font-awesome-icon/font-awesome-icon';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { TxKeyPath } from 'app/i18n';
import { AppStyles } from 'app/theme/style/AppStyles';
import React, { FC } from 'react';
import { View } from 'react-native';

interface IDrawerItemProps {
  title?: React.ReactText;
  routeName?: string;
  translatedTitle?: TxKeyPath | null;
  selected?: boolean;
  iconLeft?: any;
  iconRight?: any;
  onSelect?: (selected: boolean | undefined) => void;
  onPress?: () => void;
}

export const DrawerItem: FC<IDrawerItemProps> = props => {
  const { title, translatedTitle = null, selected, onSelect, iconLeft, iconRight, onPress } = props;

  const { t } = React.useContext(LocalizationContext);

  const onItemPress = () => {
    if (onPress) {
      onSelect && onSelect(selected);
      onPress && onPress();
    } else {
      onSelect && onSelect(selected);
    }
  };

  return (
    <Pressable
      style={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginVertical: 8,
        flex: 1,
        borderRadius: selected ? 12 : 0,
        backgroundColor: selected ? '#F5D85D' : 'transparent',
      }}
      onPress={onItemPress}
    >
      <View style={[AppStyles.hStack, { alignItems: 'center', justifyContent: 'space-between' }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {iconLeft && (
            <FontAwesomeIcon
              icon={iconLeft}
              size={20}
              colors={selected ? ['bp-support', 'bp-support'] : ['bp-white', 'bp-white']}
            />
          )}

          {title && !translatedTitle && (
            <Text
              style={{
                color: selected ? '#3E3E3C' : '#FFFFFF',
                overflow: 'hidden',
                paddingLeft: 15,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}

          {!title && translatedTitle && (
            <Text
              style={{
                color: selected ? '#3E3E3C' : '#FFFFFF',
                overflow: 'hidden',
                paddingLeft: 15,
              }}
              numberOfLines={1}
            >
              {t(translatedTitle)}
            </Text>
          )}
        </View>
        {iconRight && (
          <FontAwesomeIcon
            icon={iconRight}
            size={20}
            colors={selected ? ['bp-support', 'bp-support'] : ['bp-white', 'bp-white']}
          />
        )}
      </View>
    </Pressable>
  );
};
