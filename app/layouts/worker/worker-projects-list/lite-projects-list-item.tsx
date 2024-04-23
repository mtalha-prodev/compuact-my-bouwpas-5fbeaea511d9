import { useNavigation } from '@react-navigation/core';
import { PressableItemLite } from 'app/components/pressable-list-item/pressable-item-lite';
import { SignedInUser } from 'app/navigation/route-names';
import React, { FC } from 'react';

import { ILiteProjectListItemProps } from './worker-projects-list.types';

export const LiteProjectListItem: FC<ILiteProjectListItemProps> = React.memo(
  ({ project, subtitle, index, onPress }) => {
    const navigation = useNavigation();

    const openProjectItem = (projectId: number) => () => {
      navigation.navigate(SignedInUser.LITE_PROJECT_ITEM, { projectId });
    };

    return (
      <PressableItemLite
        title={project.projectName}
        subtitle={subtitle ?? project.contractorName}
        onPress={openProjectItem(project.liteProjectId)}
      />
    );
  },
);
