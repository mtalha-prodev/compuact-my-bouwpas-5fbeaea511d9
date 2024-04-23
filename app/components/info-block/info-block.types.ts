import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TApiError } from 'app/lib/api';

export interface InfoBlockProps {
  type: 'error' | 'info';
  bgColor?: string;
  color?: string;
  title: string;
  description?: string | null;
  apiError?: TApiError | null;
  icon?: IconProp;
}
