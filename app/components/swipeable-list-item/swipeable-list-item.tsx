import React, { FC } from 'react';
import { View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { TSwipeableListItem } from './swipeable-list-item.types';
import { Pressable } from '../pressable/pressable';

export const SwipeableListItem: FC<TSwipeableListItem> = ({
  workerId,
  renderLeftActions,
  renderRightActions,
  onSwipeableOpen,
  leftContent,
  centerContent,
  showCheckOut,
  userCanSwipe,
}) => {
  return (
    <Swipeable
      key={workerId}
      renderLeftActions={userCanSwipe ? renderLeftActions : undefined}
      renderRightActions={showCheckOut && userCanSwipe ? renderRightActions : undefined}
      onSwipeableOpen={onSwipeableOpen}
    >
      <View
        style={{
          paddingHorizontal: 16,
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          <View style={{ alignItems: 'center', marginRight: 16 }}>{leftContent}</View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
            <View style={{ alignItems: 'flex-start', marginVertical: 0 }}>{centerContent}</View>
          </View>
        </Pressable>
      </View>
    </Swipeable>
  );
};
