import Animated from 'react-native-reanimated';

export interface IDropdownChevronProps {
  progress: Animated.SharedValue<number>;
  isSelected?: boolean;
}
export interface IDropdownListItem {
  label: string;
  value: string | number;
  leftElement?: any;
}

export interface IDropdownListItemProps {
  item: IDropdownListItem;
  isLast: boolean;
  isSelected?: boolean;
}
export interface IDropdownList {
  items: IDropdownListItem[] | undefined;
}

export interface IDropdownListProps {
  list: IDropdownList;
  dropdownHeight?: number;
  placeholder: string;
  isLoading?: boolean;
  disabled?: boolean;
  zIndex?: number;
  onSelectItem?: (item: IDropdownListItem) => void;
}
