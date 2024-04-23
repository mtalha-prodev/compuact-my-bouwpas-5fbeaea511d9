import { LocalizationContext } from 'app/contexts';
import { useStore } from 'app/store/main-store/main-store';
import { pickColor } from 'app/theme/native-base/pick-color';
import React from 'react';

import Box from '../app-box/app-box';
import { ButtonGroup } from '../button-group/button-group';

export const UserModeSwitcher: React.FC = () => {
  const { t } = React.useContext(LocalizationContext);

  const [btnGroupIndex, setBtnGroupIndex] = React.useState(0);

  const userTypes = useStore.useUserTypes();
  const currentUserType = useStore.useCurrentUserType();

  const types = userTypes?.user.map(user => user.type);
  const workerUser = types?.includes('workeruser');
  const accountUser = types?.includes('accountuser');

  const bgSelected = pickColor({ name: 'bp-accent', shade: 500 });
  const textSelected = pickColor({ name: 'bp-primary', shade: 500 });

  const onValueChange = (value: number) => {
    setBtnGroupIndex(value);

    if (value === 0) useStore.setState({ currentUserType: 'worker' });
    if (value === 1) useStore.setState({ currentUserType: 'gatekeeper' });
  };

  React.useEffect(() => {
    if (currentUserType === 'worker') {
      setBtnGroupIndex(0);
    }
    if (currentUserType === 'gatekeeper') {
      setBtnGroupIndex(1);
    }
  }, [currentUserType]);

  return (
    <Box my="4" width="auto">
      {workerUser && accountUser && (
        <ButtonGroup
          selectedIndex={btnGroupIndex}
          buttons={[t('worker'), t('gatekeeper')]}
          selectedBgColor={bgSelected}
          selectedTextColor={textSelected}
          notSelectedTextColor="white"
          borderColor="white"
          onValueChange={onValueChange}
        />
      )}
    </Box>
  );
};
