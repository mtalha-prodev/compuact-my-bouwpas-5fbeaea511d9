import { useNavigation } from '@react-navigation/core';
import { PressableListItem } from 'app/components';
import { PressableItemLite } from 'app/components/pressable-list-item/pressable-item-lite';
import { env } from 'app/config/env';
import { SignedInUser } from 'app/navigation/route-names';
import React, { FC } from 'react';
import { View } from 'react-native';

import { IWorkerProjectListItemProps } from './worker-projects-list.types';

export const WorkerProjectListItem: FC<IWorkerProjectListItemProps> = React.memo(
  ({
    project,
    subtitle,
    index,
    onPress,
    isSuccess = false,
    successRightBottomIcon,
    successRightBottomText,
    otherProject = false,
  }) => {
    const navigation = useNavigation();

    const contractorName = project.contractors[0].contractorname;

    const projectBackdrop = React.useMemo(
      // Function to get image of the project based on project id
      () => (projectId: number) => `${env.IMG_URL}projects/${projectId}.png`,
      //() => (projectId: number) => `https://picsum.photos/200`,
      [],
    );

    const openProjectItem = (projectId: number) => () => {
      navigation.navigate(SignedInUser.WORKER_PROJECT_ITEM, { projectId, otherProject });
    };

    if (otherProject) {
      return (
        <PressableItemLite
          title={project.shortdescription}
          subtitle={subtitle ?? contractorName}
          onPress={openProjectItem(project.projectId)}
        />
      );
    }

    return (
      <View style={{ marginVertical: 4, marginHorizontal: 0 }}>
        <PressableListItem
          title={project.shortdescription}
          subtitle={subtitle ?? contractorName}
          image={projectBackdrop(project.projectId)}
          isSuccess={isSuccess}
          onPress={openProjectItem(project.projectId)}
          rightBottomIcon={isSuccess ? successRightBottomIcon : null}
          rightBottomText={successRightBottomText}
        />
      </View>
    );
  },
);
