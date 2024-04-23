// This approach has the additional advantage that you aren't forced to share the same common
// part of your state across all of your slices,
// but you can decide exactly which portion gets accessed by each and every slice.

import { GetState, SetState, State } from 'zustand';

// Each slice can only access its own state, plus a common part
export type SliceStateCreator<
  S extends State,
  C extends State = object, // The common part accessible by the slice
  T extends S = S & C,
  CustomSetState = SetState<T>,
> = (set: CustomSetState, get: GetState<T>) => S;
