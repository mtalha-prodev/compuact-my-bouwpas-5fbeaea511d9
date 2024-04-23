import { useNavigation } from '@react-navigation/core';
import { InfoBlock } from 'app/components';
import { LocalizationContext } from 'app/contexts';
import { TBooklet, TBookletsList } from 'app/models';
import { GlobalRoutes } from 'app/navigation/route-names';
import { AppStyles } from 'app/theme/style/AppStyles';
import React, { FC } from 'react';
import { View } from 'react-native';

import { BookletItem } from '../booklet-item/booklet-item';
import { Text } from '../text/text';

const openBooklet = ({
  id,
  crc,
  title,
}: {
  id: TBooklet['id'];
  crc: TBooklet['crc'];
  title: TBooklet['title'];
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigation = useNavigation();
  return () => {
    const bookletInfo = {
      bookletId: id,
      bookletCrc: crc,
      bookletTitle: title,
    };
    navigation.navigate(GlobalRoutes.BOOKLET_ITEM, bookletInfo);
  };
};

export const CategoryList: FC<{ data: TBookletsList; isProject: boolean; title?: string }> = ({
  data,
  isProject,
  title,
}) => {
  const { t } = React.useContext(LocalizationContext);

  return (
    <View>
      {data
        .filter(data => data.books.length !== 0 || data.isMain === true)
        .map(({ id, name, isMain, books }) => (
          <View key={id}>
            {!isMain ? (
              <Text
                style={{
                  marginLeft: 8,
                  marginTop: 6,
                  fontSize: 20,
                  textTransform: 'uppercase',
                }}
              >
                {name}
              </Text>
            ) : (
              !isProject && <Text style={AppStyles.headingTitle}>{title}</Text>
            )}
            {books.length === 0 && (
              <InfoBlock
                title={isProject ? t('bookletsListEmpty') : t('categoryListEmpty')}
                icon={['fad', 'folder-open']}
                type="info"
              />
            )}

            {books.map(({ id, title, author, image, crc }) => (
              <BookletItem
                key={id}
                title={title}
                subtitle={author}
                image={image}
                onPress={openBooklet({ id, title, crc })}
              />
            ))}
          </View>
        ))}
    </View>
  );
};
