import dayjs from 'dayjs';
import React, { FC } from 'react';
import { View } from 'react-native';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

import { IWorkerToolboxesListItemProps } from './toolbox-meeting-list-item.types';
import { FontAwesomeIcon } from '../font-awesome-icon';
import { Pressable } from '../pressable/pressable';
import { Text } from '../text/text';

export const ToolboxMeetingListItem: FC<IWorkerToolboxesListItemProps> = React.memo(
  ({ toolboxItem, index, onItemPress }) => {
    const delay = index * 25;

    return (
      <Animated.View entering={SlideInLeft.delay(delay)} exiting={SlideOutRight}>
        <Pressable onPress={onItemPress} style={{ flex: 1, width: '100%' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  marginRight: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'source-sans-pro-semibold',
                    fontSize: 18,
                    paddingVertical: 5,
                  }}
                >
                  {dayjs(toolboxItem.date).format('D')}
                </Text>
                <Text
                  style={{
                    fontFamily: 'source-sans-pro-regular',
                    fontSize: 12,
                  }}
                >
                  {dayjs(toolboxItem.date).format('MMM')}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'source-sans-pro-regular',
                  fontSize: 18,
                  overflow: 'hidden',
                  paddingVertical: 5,
                }}
              >
                {toolboxItem.toolbox.name}
              </Text>

              <Text
                style={{
                  fontFamily: 'source-sans-pro-regular',
                  fontSize: 14,
                  overflow: 'hidden',
                }}
              >
                {toolboxItem.project ? toolboxItem.project.shortdescription : '(geen project)'}
              </Text>
            </View>

            <View>
              <FontAwesomeIcon
                icon={['fas', 'chevron-right']}
                size={25}
                colors={['bp-primary', 'bp-primary']}
                colorsLevel={['500', '500']}
              />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
);
