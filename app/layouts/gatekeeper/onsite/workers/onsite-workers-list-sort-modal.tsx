import { FontAwesomeIcon } from 'app/components';
import CustomModal from 'app/components/app-modal/app-modal';
import { ModalOption } from 'app/components/modal-option/modal-option';
import { LocalizationContext } from 'app/contexts';
import { useStore } from 'app/store/main-store/main-store';
import { OnsiteWorkerTypes } from 'app/store/main-store/slices/onsite-workers-slice';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { delay } from 'app/utils';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { Pressable } from 'app/components/pressable/pressable';

interface OnsiteWorkersListSortModalProps {
  isOpen: boolean;
  onToggle: () => void;
  isShowBtnGroupByZone: boolean;
}

export const OnsiteWorkersListSortModal: FC<OnsiteWorkersListSortModalProps> = React.memo(
  ({ isOpen, onToggle, isShowBtnGroupByZone }) => {
    const { t } = React.useContext(LocalizationContext);
    const responsiveWidth = getResponsiveWidth();

    const onSiteWorkersListSortType = useStore.useOnSiteWorkersListSortType();

    

    const onModeSelect = (type: OnsiteWorkerTypes['onSiteWorkersListSortType']) => async () => {
      useStore.setState({ onSiteWorkersListSortType: type });
      await delay(200);
      onToggle();
    };

    const isGroupByCoaname = onSiteWorkersListSortType === 'groupByCoaname';
    const isGroupByZone = onSiteWorkersListSortType === 'groupByZone';
    const isDoNotGroup = onSiteWorkersListSortType === 'doNotGroup';

    return (
      <CustomModal
        isOpen={isOpen}
        onClose={onToggle}
        modalContent={
          <>
            <View style={{ width: responsiveWidth, marginLeft: 'auto', marginRight: 'auto' }}>
              <View
                style={{
                  height: 75,
                  marginHorizontal: 8,
                  paddingHorizontal: 8,
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginRight: 8,
                  }}
                >
                  <Text style={{ fontSize: 24, fontFamily: 'bilo' }}>{t('group')}</Text>
                  <Pressable onPress={onToggle}>
                    <FontAwesomeIcon
                      icon={['fas', 'times']}
                      size={25}
                      colors={['bp-primary', 'bp-primary']}
                      colorsLevel={['500', '500']}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={{ marginVertical: 8 }}>
                <ModalOption
                  isSelected={isDoNotGroup}
                  onModeSelect={onModeSelect('doNotGroup')}
                  buttonText="doNotGroup"
                />

                {isShowBtnGroupByZone && (
                  <ModalOption
                    isSelected={isGroupByZone}
                    onModeSelect={onModeSelect('groupByZone')}
                    buttonText="groupByZone"
                  />
                )}
                <ModalOption
                  isSelected={isGroupByCoaname}
                  onModeSelect={onModeSelect('groupByCoaname')}
                  buttonText="groupByCoaname"
                />
              </View>
            </View>
          </>
        }
      />
    );
  },
);
