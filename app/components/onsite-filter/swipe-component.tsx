import { useNavigation } from '@react-navigation/core';
import { SwipeableListItem } from 'app/components';
import { SwipeAction } from 'app/components/swipe-action/swipe-action';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useApiMutation } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import dayjs from 'dayjs';
import React from 'react';
import { Alert, View } from 'react-native';

interface SwipeComponentProps {
  worker: any; // Adjust the type based on your worker data structure
  removeItem: (itemId: number) => void;
  companyName: any;
  indexKey: number;
  projectId: number;
  accountId: number | undefined;
  showCheckOut: boolean;
  userCanSwipe: boolean;
}

export const SwipeComponent: React.FC<SwipeComponentProps> = ({
  worker,
  removeItem,
  companyName,
  indexKey,
  projectId,
  accountId,
  showCheckOut,
  userCanSwipe,
}) => {
  const leftAction = () => <SwipeAction align="left" />;
  const rightAction = () => <SwipeAction align="right" />;

  const { t } = React.useContext(LocalizationContext);

  // current date
  const currentDateTime = () => {
    const d = new Date();
    const settime = d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    return dayjs(settime);
  };

  // API Calling
  const { mutateAsync: postCheckOutWorkers } = useApiMutation();
  const navigation = useNavigation();

  return (
    <SwipeableListItem
      workerId={worker.workerid}
      renderLeftActions={leftAction}
      renderRightActions={rightAction}
      showCheckOut={showCheckOut}
      userCanSwipe={userCanSwipe}
      onSwipeableOpen={(direction, swipeable) => {
        if (direction === 'right') {
          Alert.alert(t('workerCheckOutAlertTitle'), t('workerCheckOutAlertDesc'), [
            {
              text: t('cancelButtonLabel'),
              style: 'cancel',
              onPress: async () => {
                swipeable.close();
              },
            },
            {
              text: t('confirmButtonLabel'),
              onPress: async () => {
                const checkOutData = {
                  loghappenedwhen: currentDateTime(),
                  chipId: worker.chipId,
                  foreignbadgeId: worker.foreignBadgeId,
                  logtypeId: 3,
                  userId: accountId,
                  project: '/v2/projects/' + projectId.toString(),
                  providerId: 2,
                };

                await postCheckOutWorkers(
                  {
                    key: env.ONSITE_LOG_ATTENDANCE,
                    method: 'post',
                    apiData: checkOutData,
                  },
                  {
                    onSuccess: async data => {
                      removeItem(worker.workerid);
                    },
                  },
                );
              },
              style: 'destructive',
            },
          ]);
        }
        if (direction === 'left') {
          navigation.navigate(SignedInUser.WORKER_INFO, {
            workerId: worker.workerid.toString(),
            projectId,
          });
          swipeable.close();
        }
      }}
      leftContent={
        <View style={{ width: 48, alignItems: 'center' }}>
          <Text>
            {dayjs(worker.loghappenedwhen).format('H')}:{dayjs(worker.loghappenedwhen).format('mm')}
          </Text>
        </View>
      }
      centerContent={
        <>
          <Text numberOfLines={1} style={{ fontSize: 18, paddingVertical: 2 }}>
            {worker.firstname}
            {worker.preposition.length > 0 ? ` ${worker.preposition} ` : ' '}
            {worker.lastname}
          </Text>
          <Text numberOfLines={1}>{companyName}</Text>
          <Text numberOfLines={1}>{worker.foreignObjectName ?? worker.gate?.name}</Text>
        </>
      }
    />
  );
};
