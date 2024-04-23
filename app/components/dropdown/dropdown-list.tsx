import { pickColor } from 'app/theme/native-base/pick-color';
import React, { FC } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
  runOnUI,
} from 'react-native-reanimated';

import { DropdownChevron } from './dropdown-chevron';
import { DropdownListItem } from './dropdown-list-item';
import { IDropdownListItem, IDropdownListProps } from './dropdown.types';
import Box from '../app-box/app-box';
import { Pressable } from '../pressable/pressable';
import { Text } from '../text/text';

export const DropdownList: FC<IDropdownListProps> = React.memo(
  ({
    list,
    placeholder,
    dropdownHeight = 200,
    isLoading,
    disabled,
    zIndex = 1000,
    onSelectItem,
  }) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [dropdownValue, setDropdownValue] = React.useState(placeholder);
    const colorPick = pickColor({ name: 'bp-primary', shade: 300 });
    const open = useSharedValue(false);
    const progress = useDerivedValue(() => (open.value ? withSpring(1) : withTiming(0)));
    const height = useSharedValue(0);
    const headerStyle = useAnimatedStyle(() => ({
      borderBottomLeftRadius: progress.value === 0 ? 8 : 0,
      borderBottomRightRadius: progress.value === 0 ? 8 : 0,
    }));
    const hiddenBottomStyles = useAnimatedStyle(() => ({
      borderBottomLeftRadius: progress.value === 10 ? 0 : 10,
      borderBottomRightRadius: progress.value === 10 ? 0 : 10,
    }));
    const rDopdownStyle = useAnimatedStyle(() => ({
      height: height.value * progress.value + 1,
      opacity: progress.value === 0 ? 0 : 1,
    }));

    const onOpenDropdown = () => {
      if (height.value === 0) {
        runOnUI(() => {
          'worklet';
          height.value = dropdownHeight;
        })();
      }
      open.value = !open.value;
      setIsDropdownOpen(!open.value);
    };

    const onItemPress = (item: IDropdownListItem) => () => {
      onSelectItem && onSelectItem(item);
      setDropdownValue(item.label);
      onOpenDropdown();
    };

    return (
      <Box zIndex={zIndex} width="auto">
        <Pressable onPress={onOpenDropdown} disabled={isLoading}>
          <Animated.View
            style={[
              headerStyle,
              {
                backgroundColor: colorPick,
                borderColor: colorPick,
                padding: 16,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex,
              },
            ]}
          >
            <View style={{ flex: 1, marginRight: 3 }}>
              <Text style={{ fontSize: 22 }} numberOfLines={1}>
                {dropdownValue}
              </Text>
            </View>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={pickColor({ name: 'bp-primary', shade: 700 })}
              />
            ) : (
              <DropdownChevron progress={progress} isSelected={isDropdownOpen} />
            )}
          </Animated.View>
        </Pressable>

        <Animated.View
          style={[
            rDopdownStyle,
            hiddenBottomStyles,
            {
              borderColor: colorPick,
              borderWidth: 3,
            },
          ]}
        >
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: 'white' }}
          >
            {list.items?.map((item, key) => (
              <Pressable key={key} onPress={onItemPress(item)}>
                <DropdownListItem
                  isSelected={item.label === dropdownValue}
                  //@ts-ignore
                  isLast={key === list.items.length - 1}
                  {...{ item }}
                />
              </Pressable>
            ))}
            {!list.items && (
              <View>
                <Text>Ooops...</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </Box>
    );
  },
);
