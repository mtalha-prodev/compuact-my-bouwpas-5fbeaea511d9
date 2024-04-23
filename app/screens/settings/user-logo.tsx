import { InfoBlock } from 'app/components';
import AvatarComponent from 'app/components/app-avatar/AvatarComponent';
import CustomSpinner from 'app/components/app-spinner/AppSpinner';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useWhoAmI } from 'app/hooks';
import { useStore } from 'app/store/main-store/main-store';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import React from 'react';
import { View } from 'react-native';

export const UserLogo = () => {
  const { t } = React.useContext(LocalizationContext);

  const isSignedIn = useStore.useBootstrapState().isSignedIn;
  const userType = useStore.useCurrentUserType();

  const accountUser = useStore.useUserTypes()?.user.find(user => user.type === 'accountuser');
  const companyUser = useStore.useUserTypes()?.user.find(user => user.type === 'companyuser');
  const currentUserType = useStore.useCurrentUserType();

  const {
    data: user,
    status,
    error: userError,
  } = useWhoAmI(isSignedIn && currentUserType === 'worker');

  const { showLoading, showData } = useApiCallStatus(status);

  return (
    <>
      {isSignedIn && (
        <View style={AppStyles.box}>
          {showLoading && (
            <CustomSpinner size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
          )}

          {userError && (
            <View
              style={{
                marginHorizontal: 2,
                marginVertical: 4,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <InfoBlock
                title={t('errorWhoAmI')}
                icon={['fad', 'exclamation-square']}
                type="error"
                apiError={userError}
              />
            </View>
          )}

          {showData && user && userType === 'worker' && (
            <View style={AppStyles.hStack}>
              <AvatarComponent
                accountUser={{
                  firstname: user.firstname,
                  lastname: user.lastname,
                  userType: 'worker',
                }}
              />

              <View style={AppStyles.marginLeft2}>
                <Text style={AppStyles.fontSizeLg}>{`${user.firstname}${
                  user.preposition.length > 0 ? ` ${user.preposition}` : ''
                } ${user.lastname}`}</Text>

                <Text style={AppStyles.fontSizeMd} numberOfLines={1}>
                  {`${user.email}`}
                </Text>
                <Text style={AppStyles.fontSizeMd} numberOfLines={1}>
                  {t('worker')}
                </Text>
              </View>
            </View>
          )}

          {userType === 'gatekeeper' && accountUser && (
            <View style={AppStyles.hStack}>
              <AvatarComponent
                accountUser={{ username: accountUser.username, userType: 'gatekeeper' }}
              />

              <View style={AppStyles.marginLeft2}>
                <Text style={[AppStyles.fontSizeLg]}>{accountUser.username}</Text>
                <Text style={AppStyles.fontSizeMd} numberOfLines={1}>
                  {t('gatekeeper')}
                </Text>
              </View>
            </View>
          )}

          {userType === 'companyuser' && companyUser && (
            <View style={AppStyles.hStack}>
              <AvatarComponent
                accountUser={{ username: companyUser.username, userType: 'companyuser' }}
              />

              <View style={AppStyles.marginLeft2}>
                <Text style={AppStyles.fontSizeLg}>{companyUser.username}</Text>
                <Text style={AppStyles.fontSizeMd} numberOfLines={1}>
                  {t('companyuser')}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};
