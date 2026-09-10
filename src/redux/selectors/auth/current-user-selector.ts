import { currentUserSliceInitialState } from "@/redux/slices/auth/current-user-slice"
import type { RootState } from "@/store/store"
import { createSelector } from "@reduxjs/toolkit"


const selectCurrentUserState = (state: RootState) =>
  state.currentUser || currentUserSliceInitialState

/**
 *
 * Selectors to get the user States from the user slice.
 *
 */
export const selectCurrentUSer = createSelector([selectCurrentUserState], (currentUser) => currentUser ?? null)