import { FontAwesomeIcon } from 'app/components/font-awesome-icon';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { TxKeyPath } from 'app/i18n';
import { AppStyles } from 'app/theme/style/AppStyles';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IBottomTabBarItemProps {
  title?: React.ReactText;
  translatedTitle?: TxKeyPath | undefined;
  icon?: any;
  selected?: boolean;
  onSelect?: (selected: boolean | undefined) => void;
  iconPosition?: 'top' | 'right' | 'bottom' | 'left';
}

export const BottomTabBarItem: FC<IBottomTabBarItemProps> = props => {
  const {
    title,
    translatedTitle = undefined,
    icon = ['fad', 'helmet-safety'],
    iconPosition = 'top',
    onSelect,
    selected,
  } = props;

  const { t } = React.useContext(LocalizationContext);

  const onPress = () => {
    onSelect && onSelect(selected);
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[AppStyles.hStack, { flex: 1, paddingBottom: insets.bottom + 4 }]}>
      <View
        style={{
          flex: 1,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Pressable onPress={onPress}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {icon && iconPosition === 'top' && (
              <View style={{ marginBottom: 2 }}>
                <FontAwesomeIcon
                  size={25}
                  icon={icon}
                  colors={selected ? ['bp-accent', 'bp-support'] : ['bp-primary', 'bp-primary']}
                  secondaryColors={
                    selected ? ['bp-primary', 'bp-primary'] : ['bp-support', 'bp-support']
                  }
                  colorsLevel={selected ? ['500', '500'] : ['500', '500']}
                  secondaryColorsLevel={selected ? ['500', '500'] : ['500', '500']}
                />
              </View>
            )}

            {title && !translatedTitle && (
              <Text
                style={{
                  maxWidth: 40,
                  overflow: 'hidden',
                  color: 'black',
                  fontFamily: 'interstate',
                }}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}

            {!title && translatedTitle && (
              <Text style={{ fontFamily: 'interstate', color: 'black' }} numberOfLines={1}>
                {t(translatedTitle)}
              </Text>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
};
