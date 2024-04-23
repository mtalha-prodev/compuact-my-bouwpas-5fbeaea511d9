import { Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
type AnimatedInterpolation = ReturnType<Animated.Value['interpolate']>;

export type TSwipeableListItem = {
  renderLeftActions?: (
    progressAnimatedValue: AnimatedInterpolation,
    dragAnimatedValue: AnimatedInterpolation,
    swipeable: Swipeable,
  ) => React.ReactNode;
  renderRightActions?: (
    progressAnimatedValue: AnimatedInterpolation,
    dragAnimatedValue: AnimatedInterpolation,
    swipeable: Swipeable,
  ) => React.ReactNode;
  onSwipeableOpen: (direction: 'left' | 'right', swipeable: Swipeable) => void;
  leftContent: any;
  centerContent: any;
  workerId: number;
  showCheckOut: boolean;
  userCanSwipe: boolean;
};
