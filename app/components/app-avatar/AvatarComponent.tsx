import React from 'react';
import { View, Text } from 'react-native';

interface AvatarComponentProps {
  accountUser: {
    firstname?: string;
    lastname?: string;
    username?: string;
    userType: string;
  };
}

const AvatarComponent: React.FC<AvatarComponentProps> = ({ accountUser }) => {
  const avatarTitle = (name: string) => {
    return name ? name.toString().substring(0, 1).toUpperCase() : '';
  };

  return (
    <View
      style={{
        backgroundColor: '#475949',
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 35,
          color: 'white',
          fontFamily: 'interstate',
        }}
      >
        {accountUser.userType === 'worker'
          ? `${avatarTitle(accountUser.firstname ?? '')}${avatarTitle(accountUser.lastname ?? '')}`
          : `${avatarTitle(accountUser.username ?? '')}`}
      </Text>
    </View>
  );
};

export default AvatarComponent;
