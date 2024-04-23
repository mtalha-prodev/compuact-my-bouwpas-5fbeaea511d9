import { FontAwesomeIcon, HeaderNav, InfoBlock } from 'app/components';
import { CategoryList } from 'app/components/booklets-list/booklets-category-list';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useBookletsList } from 'app/hooks';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { delay } from 'app/utils';
import React, { FC } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';

export const BookletsList: FC = React.memo(() => {
  const { t } = React.useContext(LocalizationContext);

  const responsiveWidth = getResponsiveWidth();

  //Always open booklets on default category 1 (algemeen)
  const [category, setCategory] = React.useState(env.ALGEMEEN);

  const { status, data, refetch } = useBookletsList(category);

  const { showData, showLoading } = useApiCallStatus(status);

  const [refreshing, setRefreshing] = React.useState(false);

  const categoryList = [
    {
      id: env.ALGEMEEN,
      title: t('algemeen'),
      icon: ['fad', 'users'],
    },
    {
      id: env.VEILIGHEID,
      title: t('veiligheid'),
      icon: ['fad', 'traffic-cone'],
    },
    {
      id: env.KWALITEIT,
      title: t('kwaliteit'),
      icon: ['fad', 'file-check'],
    },
    {
      id: env.MILIEU,
      title: t('milieu'),
      icon: ['fad', 'earth-europe'],
    },
  ];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  const changeCategory = async (event: any, value: number) => {
    await delay(100);
    setCategory(value);
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav title={t('bookletsHeader')} leftElement="drawer" />
      <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth, flex: 1 }]}>
        {showLoading && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
          </View>
        )}
        {showData && data && (
          <ScrollView
            style={AppStyles.scrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {!data.length && (
              <View
                style={{
                  backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
                  borderRadius: 16,
                  shadowColor: pickColorSingleShade({ name: 'bp-black' }),
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  elevation: 5,
                  paddingHorizontal: 0,
                  paddingVertical: 20,
                  marginTop: 16,
                  marginHorizontal: 16,
                }}
              >
                <InfoBlock
                  title={t('bookletsListEmpty')}
                  icon={['fad', 'folder-open']}
                  type="info"
                />
              </View>
            )}

            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // backgroundColor: 'red',
              }}
            >
              {categoryList.map(({ id, title, icon }) => (
                <Pressable
                  key={id}
                  style={(pressed: boolean) => ({
                    backgroundColor: pressed ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                  })}
                  onPress={(event: any) => {
                    changeCategory(event, id);
                  }}
                >
                  <View
                    style={{
                      alignItems: 'center',
                    }}
                  >
                    <FontAwesomeIcon
                      //@ts-ignore
                      icon={icon}
                      size={25}
                      colors={
                        id === category ? ['bp-accent', 'bp-support'] : ['bp-primary', 'bp-primary']
                      }
                      secondaryColors={
                        id === category
                          ? ['bp-primary', 'bp-primary']
                          : ['bp-support', 'bp-support']
                      }
                      colorsLevel={id === category ? ['500', '500'] : ['500', '500']}
                      secondaryColorsLevel={id === category ? ['500', '500'] : ['500', '500']}
                    />
                    <Text style={[AppStyles.fontSizeMd, AppStyles.marginTop2]}>{title}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
            {data !== undefined && (
              <CategoryList
                data={data}
                isProject={false}
                title={
                  categoryList
                    .filter(item => item.id === category)
                    .map(item => {
                      return item.title;
                    })[0]
                }
              />
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
});
