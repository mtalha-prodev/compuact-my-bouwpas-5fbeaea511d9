import { SliceStateCreator } from '../../helpers/slice-creator';

export type WizardSlaceTypes = {
  wizard: boolean;
};

export const createWizardSlice: SliceStateCreator<WizardSlaceTypes> = (): WizardSlaceTypes => ({
  wizard: false,
});
