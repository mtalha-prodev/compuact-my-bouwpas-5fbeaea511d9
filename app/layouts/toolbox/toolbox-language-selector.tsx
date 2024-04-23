import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CustomModal from 'app/components/app-modal/app-modal';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { useStore } from 'app/store/main-store/main-store';
import { UserStateSlaceTypes } from 'app/store/main-store/slices/user-slice';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { Image, ImageSourcePropType, View, FlatList, TouchableOpacity } from 'react-native';

type TCountryFlagList = {
  code: UserStateSlaceTypes['currentTooloboxLang'];
  flag: ImageSourcePropType;
}[];

const countries: TCountryFlagList = [
  { code: 'EN', flag: require('app/assets/images/flags/EN.png') },
  { code: 'NL', flag: require('app/assets/images/flags/NL.png') },
  { code: 'RO', flag: require('app/assets/images/flags/RO.png') },
  { code: 'DE', flag: require('app/assets/images/flags/DE.png') },
  { code: 'PL', flag: require('app/assets/images/flags/PL.png') },
  { code: 'TR', flag: require('app/assets/images/flags/TR.png') },
];

export const ToolboxLanguageSelector: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const responsiveWidth = getResponsiveWidth();

  const currentTooloboxLang = useStore.useCurrentTooloboxLang();

  const { isOpen, onOpen, onClose, onToggle } = useDisclose();

  const setToolboxLang = (lang: UserStateSlaceTypes['currentTooloboxLang']) => () => {
    useStore.setState({ currentTooloboxLang: lang });
    onClose();
  };

  const getFlagName = () => {
    const flags = countries.find(country => country.code === currentTooloboxLang);
    return flags?.flag as ImageSourcePropType;
  };

  return (
    <View>
      <Pressable onPress={onOpen}>
        <View style={{ backgroundColor: 'white', padding: 4, borderRadius: 999 }}>
          <Image source={getFlagName()} style={{ width: 25, height: 25 }} />
        </View>
      </Pressable>

      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        modalContent={
          <View
            style={[
              AppStyles.responsiveWidthBox,
              { width: responsiveWidth, paddingHorizontal: 10 },
            ]}
          >
            <View
              style={{
                height: 75,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginRight: 8,
              }}
            >
              <Text
                style={[
                  AppStyles.headingTitle,
                  { color: pickColor({ name: 'bp-primary', shade: 500 }), fontSize: 25 },
                ]}
              >
                {t('chooseYourLanguage')}
              </Text>
              <Pressable onPress={onToggle}>
                <FontAwesomeIcon
                  icon={['fas', 'times']}
                  size={25}
                  colors={['bp-primary']} // Assuming bp-primary is your color
                />
              </Pressable>
            </View>
            <View style={{ width: '100%', marginVertical: 16 }}>
              <FlatList
                data={countries}
                keyExtractor={({ code }) => code}
                numColumns={3}
                renderItem={({ item: { code, flag } }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 8,
                      margin: 2,
                      flex: 1,
                      backgroundColor: pickColor({ name: 'bp-primary', shade: 500 }),
                      borderRadius: 4,
                    }}
                    onPress={setToolboxLang(code)}
                  >
                    <Image source={flag} style={{ width: 32, height: 32, marginRight: 8 }} />
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{code}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        }
      />
    </View>
  );
};
