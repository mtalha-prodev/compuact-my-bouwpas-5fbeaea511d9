export const buttonBaseStyle = {
  baseStyle: {
    rounded: 'xl',
    _text: {
      color: 'white',
      fontFamily: 'interstate',
      py: '2.5',
      numberOfLines: 1,
      isTruncated: true,
      _light: {
        color: 'white',
        fontSize: 'lg',
      },
      _dark: {
        color: 'white',
        fontSize: 'lg',
      },
    },
    _light: {
      bg: 'bp-support.500',
    },
    _dark: {
      bg: 'bp-support.500',
    },
    _disabled: {
      bg: 'bp-support.300',
      _text: {
        color: 'bp-primary.500',
        _light: {
          color: 'bp-primary.500',
        },
        _dark: {
          color: 'bp-primary.500',
        },
      },
    },
  },
  variants: {
    'with-icon': {
      justifyContent: 'flex-start',
      pl: '4',
      _text: {
        pl: '1',
      },
    },
    inverted: {
      _text: {
        _light: {
          color: 'bp-primary.500',
        },
        _dark: {
          color: 'bp-primary.500',
        },
      },
      _light: {
        bg: 'white',
      },
      _dark: {
        bg: 'white',
      },
    },
  },
  defaultProps: {
    variant: 'bp',
  },
};
