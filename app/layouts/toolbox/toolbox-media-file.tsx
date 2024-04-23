import { FontAwesomeIcon } from 'app/components';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { tcatch } from 'app/utils';
import { openBrowserAsync } from 'expo-web-browser';
import React, { FC } from 'react';
import { Pressable, View } from 'react-native';

import { TToolboxMediaItem } from '../worker/worker-toolboxes-list/worker-toolboxes.types';

interface IMediaFileProps {
  media: TToolboxMediaItem;
}

export const ToolboxMediaFile: FC<IMediaFileProps> = ({ media }) => {
  const { t } = React.useContext(LocalizationContext);

  const openUrl = async () => {
    await tcatch(openBrowserAsync(media.publicUrl));
  };

  return (
    <Pressable onPress={openUrl}>
      <View style={{ flexDirection: 'row', borderRadius: 4, marginVertical: 2 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text numberOfLines={1}>{media.name ? media.name : t('file')}</Text>
        </View>
        <View style={{ paddingHorizontal: 0, paddingVertical: 2 }}>
          <FontAwesomeIcon
            icon={['fad', 'external-link-alt']}
            size={25}
            colors={['bp-primary', 'bp-primary']}
            colorsLevel={['500', '500']}
          />
        </View>
      </View>
    </Pressable>
  );
};
