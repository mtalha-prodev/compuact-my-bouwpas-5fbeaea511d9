import { SwipeAction } from 'app/components/swipe-action/swipe-action';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useStore } from 'app/store/main-store/main-store';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { tcatch } from 'app/utils';
import { openBrowserAsync } from 'expo-web-browser';
import React from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { FontAwesomeIcon } from '../font-awesome-icon';

export const SwipeTour: React.FC = () => {
  const leftAction = () => <SwipeAction align="left" />;

  const { t } = React.useContext(LocalizationContext);

  const updateState = () => {
    useStore.setState({ showSwipeTour: false });
  };

  return (
    <View>
      <Swipeable
        renderLeftActions={leftAction}
        onSwipeableOpen={(direction, swipeable) => {
          if (direction === 'left') {
            Alert.alert(t('WorkerInfoHelpTitle'), t('WorkerInfoHelpDesc'), [
              {
                text: t('showArticle'),
                onPress: async () => {
                  await tcatch(openBrowserAsync(env.MBA_HELP_GATEKEEPER_SWIPE));
                  swipeable.close();
                },
              },
              {
                text: t('closeButtonLabel'),
                onPress: async () => {
                  swipeable.close();
                },
              },
            ]);
          }
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: pickColor({ name: 'bp-correct', shade: 500 }),
          }}
        >
          <View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
              }}
            >
              <View style={{ width: 48 }}>
                <FontAwesomeIcon
                  icon={['fas', 'chevrons-right']}
                  size={25}
                  colors={['bp-primary', 'bp-accent']}
                />
              </View>
              <View>
                <Text
                  style={{ fontSize: 22, color: pickColor({ name: 'bp-primary', shade: 500 }) }}
                >
                  {t(`swipeHere`)}
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
            }}
            onPress={updateState}
          >
            <FontAwesomeIcon
              icon={['fas', 'times']}
              size={25}
              colors={['bp-primary', 'bp-accent']}
            />
          </Pressable>
        </View>
      </Swipeable>
      <View style={[AppStyles.dividerNoMargin]} />
    </View>
  );
};
