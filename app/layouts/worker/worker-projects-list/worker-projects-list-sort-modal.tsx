import { FontAwesomeIcon } from 'app/components';
import CustomModal from 'app/components/app-modal/app-modal';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { useStore } from 'app/store/main-store/main-store';
import { WorkerSlaceTypes } from 'app/store/main-store/slices/worker-slice';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { delay } from 'app/utils';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface WorkerProjectListSortModalProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const WorkerProjectListSortModal: FC<WorkerProjectListSortModalProps> = React.memo(
  ({ isOpen, onToggle }) => {
    const { t } = React.useContext(LocalizationContext);

    const projectsListSortType = useStore.useProjectsListSortType();

    const [, setLoadingBtn] = React.useState(false);

    const onModeSelect = (type: WorkerSlaceTypes['projectsListSortType']) => async () => {
      setLoadingBtn(true);
      if (type === 'closest') {
        const { status } = await requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoadingBtn(false);
          return;
        }
        const location = await getCurrentPositionAsync({});
        useStore.setState({ deviceLocation: location });
      }
      useStore.setState({ projectsListSortType: type });
      await delay(200);
      setLoadingBtn(false);
      onToggle();
    };

    const isClosest = projectsListSortType === 'closest';
    const isNewest = projectsListSortType === 'newest';
    const isAbc = projectsListSortType === 'abc';

    return (
      <CustomModal
        isOpen={isOpen}
        onClose={onToggle}
        modalContent={
          <>
            <View
              style={{
                height: 75,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'bilo',
                }}
              >
                {t('projectItemsSortHeader')}
              </Text>
              <Pressable onPress={onToggle}>
                <FontAwesomeIcon
                  icon={['fas', 'times']}
                  size={25}
                  colors={['bp-primary']} // Assuming bp-primary is your color
                />
              </Pressable>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'bilo',
              }}
            >
              {t('projectItemsSortBody')}
            </Text>
            <TouchableOpacity
              onPress={onModeSelect('closest')}
              style={[
                AppStyles.button,
                {
                  backgroundColor: isClosest
                    ? pickColor({ name: 'bp-correct', shade: 800 })
                    : pickColor({ name: 'bp-support', shade: 500 }),
                },
              ]}
            >
              <>
                <FontAwesomeIcon
                  icon={['fas', 'map-marked-alt']}
                  size={25}
                  colors={['bp-white', 'bp-white']}
                  colorsLevel={['500', '500']}
                />
                <Text style={AppStyles.buttonText}>{t('projectItemsSortGeo')}</Text>
              </>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onModeSelect('newest')}
              style={[
                AppStyles.button,
                {
                  backgroundColor: isNewest
                    ? pickColor({ name: 'bp-correct', shade: 800 })
                    : pickColor({ name: 'bp-support', shade: 500 }),
                },
              ]}
            >
              <>
                <FontAwesomeIcon
                  icon={['fas', 'map-marked-alt']}
                  size={25}
                  colors={['bp-white', 'bp-white']}
                  colorsLevel={['500', '500']}
                />
                <Text style={AppStyles.buttonText}>{t('projectItemsSortNewest')}</Text>
              </>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onModeSelect('abc')}
              style={[
                AppStyles.button,
                {
                  backgroundColor: isAbc
                    ? pickColor({ name: 'bp-correct', shade: 800 })
                    : pickColor({ name: 'bp-support', shade: 500 }),
                },
              ]}
            >
              <>
                <FontAwesomeIcon
                  icon={['fas', 'map-marked-alt']}
                  size={25}
                  colors={['bp-white', 'bp-white']}
                  colorsLevel={['500', '500']}
                />
                <Text style={AppStyles.buttonText}>{t('projectItemsSortAlpha')}</Text>
              </>
            </TouchableOpacity>
          </>
        }
      />
    );
  },
);
