import { HeaderNav } from 'app/components';
import CustomSpinner from 'app/components/app-spinner/AppSpinner';
import { FloatingActionButton } from 'app/components/button-group/floating-action-button';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useWorkerProjectsList } from 'app/hooks';
import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { pickColor } from 'app/theme/native-base/pick-color';
import React, { FC } from 'react';
import { View } from 'react-native';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

import { LiteProjectsListBody } from './lite-projects-list-body';
import { WorkerProjectListSortModal } from './worker-projects-list-sort-modal';
import { ANIMATION_DURATION } from './worker-projects-list.constants';

export const LiteProjects: FC = React.memo(() => {
  const { t } = React.useContext(LocalizationContext);

  const { status: projectListStatus } = useWorkerProjectsList(true);
  const { showLoading: showProjectsListLoading } = useApiCallStatus(projectListStatus);
  const { isOpen, onToggle } = useDisclose();

  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav title={t('liteProjectsLabel')} leftElement="back" />

      <View style={{ flex: 1 }}>
        {showProjectsListLoading && (
          <Animated.View
            entering={SlideInLeft.duration(ANIMATION_DURATION)}
            exiting={SlideOutRight.duration(ANIMATION_DURATION)}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <CustomSpinner size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
            </View>
          </Animated.View>
        )}
        {!showProjectsListLoading && (
          <Animated.View
            entering={SlideInLeft.duration(ANIMATION_DURATION)}
            exiting={SlideOutRight.duration(ANIMATION_DURATION)}
            style={{ flex: 1 }}
          >
            <LiteProjectsListBody />
          </Animated.View>
        )}
      </View>
      <FloatingActionButton onPress={onToggle} iconName="sort-amount-up" />
      <WorkerProjectListSortModal isOpen={isOpen} onToggle={onToggle} />
    </View>
  );
});
