import { useWindowDimensions } from 'react-native';

export const getResponsiveWidth = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const windowWidth = useWindowDimensions().width;

  // Define your breakpoints
  const breakpoints = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1600,
  };

  if (windowWidth <= breakpoints.xs) {
    return '100%';
  } else if (windowWidth > breakpoints.xs && windowWidth <= breakpoints.sm) {
    return '100%';
  } else if (windowWidth > breakpoints.sm && windowWidth <= breakpoints.md) {
    return '80%';
  } else if (windowWidth > breakpoints.md && windowWidth <= breakpoints.lg) {
    return '70%';
  } else if (windowWidth > breakpoints.lg && windowWidth <= breakpoints.xl) {
    return '60%';
  } else {
    return '100%';
  }
};
