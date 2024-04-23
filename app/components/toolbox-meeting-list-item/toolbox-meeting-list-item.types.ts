import { TMeetingItem } from 'app/layouts/worker/worker-toolboxes-list/worker-toolboxes.types';

export interface IWorkerToolboxesListItemProps {
  toolboxItem: TMeetingItem;
  index: number;
  onItemPress: () => void;
}
