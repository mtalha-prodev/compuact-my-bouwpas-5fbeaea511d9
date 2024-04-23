import { useRoute } from '@react-navigation/core';
import { HeaderNav } from 'app/components';
import { FloatingActionButton } from 'app/components/button-group/floating-action-button';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useWorkerProjectsList } from 'app/hooks';
import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { pickColor } from 'app/theme/native-base/pick-color';
import React, { FC, useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

import { WorkerProjectsListBody } from './worker-projects-list-body';
import { WorkerProjectListQrAttendance } from './worker-projects-list-qr-attendance';
import { WorkerProjectListSortModal } from './worker-projects-list-sort-modal';
import { ANIMATION_DURATION } from './worker-projects-list.constants';
import { RouteProps, TDecodedQRAttendance } from './worker-projects-list.types';

export const WorkerProjectsList: FC = React.memo(() => {
  const { t } = React.useContext(LocalizationContext);
  const route = useRoute<RouteProps>();
  const qrData: TDecodedQRAttendance = route.params?.qrData.content;
  const [isVisible, setIsVisible] = useState(false);

  //On iphones, when animation is still in process or ending, sometimes opening the modal to check-in/out does not work.
  //We will set a timeout to give enough time for the project list animation to complete to be sure modal will always work.
  //Since useEffect is called on mount and everytime qrData changes, when qrData is empty we will not update isVisible.
  //This is only updated after we scan the QR once.
  useEffect(() => {
    if (qrData) {
      const timeout = setTimeout(() => {
        setIsVisible(true); // After timeout, set isVisible to true
      }, 2000); // Delay of 2000 milliseconds (2 seconds)
      // Cleanup function to clear the timeout in case component unmounts before the timeout completes
      return () => clearTimeout(timeout);
    }
  }, [qrData]);
  const { status: projectListStatus } = useWorkerProjectsList();
  const { showLoading: showProjectsListLoading } = useApiCallStatus(projectListStatus);
  const { isOpen, onToggle } = useDisclose();
  const { isOpen: isAttendanceModalOpen, onToggle: onAttendanceModalToggle } = useDisclose();

  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav title={t('projectsPageTabNav1')} leftElement="drawer" />

      <View style={{ flex: 1 }}>
        {showProjectsListLoading && (
          <Animated.View
            entering={SlideInLeft.duration(ANIMATION_DURATION)}
            exiting={SlideOutRight.duration(ANIMATION_DURATION)}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator
                size="large"
                color={pickColor({ name: 'bp-primary', shade: 500 })}
              />
            </View>
          </Animated.View>
        )}
        {!showProjectsListLoading && (
          <Animated.View
            entering={SlideInLeft.duration(ANIMATION_DURATION)}
            exiting={SlideOutRight.duration(ANIMATION_DURATION)}
            style={{ flex: 1 }}
          >
            <WorkerProjectsListBody />
          </Animated.View>
        )}
      </View>
      <FloatingActionButton onPress={onToggle} iconName="sort-amount-up" />
      <WorkerProjectListSortModal isOpen={isOpen} onToggle={onToggle} />
      {qrData && isVisible && (
        <View>
          <WorkerProjectListQrAttendance
            isOpen={isAttendanceModalOpen}
            onToggle={onAttendanceModalToggle}
            qrData={qrData}
          />
        </View>
      )}
    </View>
  );
});
