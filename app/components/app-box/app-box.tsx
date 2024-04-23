import React from 'react';
import { View, ViewStyle } from 'react-native';

interface BoxProps {
  mx?: string | number;
  my?: string | number;
  mt?: string | number;
  mb?: string | number;
  px?: string | number;
  py?: string | number;
  width?: string | number;
  flex?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  bg?: string | any;
  style?: ViewStyle;
  rounded?: string;
  shadow?: number;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  children?: React.ReactNode;
  overflow?: 'visible' | 'hidden' | 'scroll';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  zIndex?: number;
  p?: number;
  key?: React.Key;
  position?: 'absolute' | 'relative';
  bottom?: number;
}

const spaceMapping: { [key: string]: number } = {
  1: 4,
  2: 8,
  3: 12,
};

const interpretSpace = (value: string | number): number => {
  const parsedValue = parseInt(value as string, 10);
  return !isNaN(parsedValue) ? spaceMapping[parsedValue] || parsedValue : 0;
};

const interpretWidth = (value: string | number): number | string => {
  const parsedValue = parseInt(value as string, 10);
  return !isNaN(parsedValue) ? parsedValue || value : 'auto';
};

const Box: React.FC<BoxProps> = ({
  mx,
  my,
  mt,
  mb,
  px,
  py,
  width,
  flex,
  alignItems,
  bg,
  style,
  rounded,
  shadow,
  justifyContent,
  children,
  overflow,
  flexDirection,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  zIndex,
  position,
  p,
  key,
  bottom,
}) => {
  const marginHorizontal = interpretSpace(mx! || my!);
  const marginTop = interpretSpace(mt!);
  const marginBottom = interpretSpace(mb!);
  const paddingHorizontal = interpretSpace(px ?? 0);
  const paddingVertical = interpretSpace(py ?? 0);

  const borderRadius = style?.borderRadius ?? (rounded ? interpretSpace(rounded) : 0);

  const finalStyle: ViewStyle = {
    marginHorizontal,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    marginTop,
    marginBottom,
    paddingHorizontal,
    paddingVertical,
    width: interpretWidth(width ?? 0),
    flex,
    alignItems,
    backgroundColor: bg,
    borderRadius,
    shadowOffset: { width: 0, height: shadow ?? 0 },
    shadowOpacity: shadow ? 0.2 : 0,
    shadowRadius: shadow ?? 0,
    justifyContent,
    overflow,
    flexDirection,
    zIndex,
    elevation: zIndex,
    padding: p ?? 0,
    position,
    bottom,
    ...style,
  };

  return (
    <View style={finalStyle} key={key}>
      {children}
    </View>
  );
};

export default Box;
